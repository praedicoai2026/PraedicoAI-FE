import { Types } from "mongoose";
import { HttpError } from "../../errors/http-error.js";
import { User } from "../auth/user.model.js";
import { EmployeeProfile } from "./employee.model.js";
import { Project } from "./project.model.js";
import type {
  EmployeeProfileUpdate,
  EmployeeProfileUpsert,
  ProjectCreate,
  ProjectUpdate,
} from "./employee.schema.js";

type EmployeeActor = {
  id: string;
  permissions?: string[];
};

function accountObjectIds(ids: string[]) {
  return [...new Set(ids)].map((id) => new Types.ObjectId(id));
}

async function assertEmployeeAccounts(ids: string[]) {
  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length) return;
  const employees = await User.find({
    _id: { $in: accountObjectIds(uniqueIds) },
    role: "employee",
    isActive: true,
  })
    .select("_id")
    .lean();
  if (employees.length !== uniqueIds.length) {
    throw new HttpError(
      400,
      "INVALID_EMPLOYEE",
      "Each selected employee must have an active employee account.",
    );
  }
}

async function assertManagerAccount(managerId: string | null | undefined) {
  if (!managerId) return;
  const manager = await User.findOne({
    _id: managerId,
    role: {
      $in: ["super_admin", "admin", "hr_manager", "project_manager"],
    },
    isActive: true,
  })
    .select("_id")
    .lean();
  if (!manager) {
    throw new HttpError(
      400,
      "INVALID_MANAGER",
      "The selected manager account is not active or eligible.",
    );
  }
}

async function assertProjectAccounts(ownerId: string, memberIds: string[]) {
  const owner = await User.findOne({
    _id: ownerId,
    role: { $in: ["employee", "project_manager", "admin", "super_admin"] },
    isActive: true,
  })
    .select("_id")
    .lean();
  if (!owner) {
    throw new HttpError(
      400,
      "INVALID_PROJECT_OWNER",
      "The project owner must have an active eligible account.",
    );
  }
  await assertEmployeeAccounts(memberIds);
}

export async function listEmployees() {
  const users = await User.find({ role: "employee" })
    .select("fullName email isActive")
    .sort({ fullName: 1 })
    .lean();
  const userIds = users.map((user) => user._id);
  const profiles = await EmployeeProfile.find({ userId: { $in: userIds } })
    .select("userId department jobTitle managerId workStatus")
    .lean();
  const managerIds = profiles.flatMap((profile) =>
    profile.managerId ? [profile.managerId] : [],
  );
  const managers = managerIds.length
    ? await User.find({ _id: { $in: managerIds } })
        .select("fullName email")
        .lean()
    : [];
  const profileByUser = new Map(
    profiles.map((profile) => [profile.userId.toString(), profile]),
  );
  const managerById = new Map(
    managers.map((manager) => [manager._id.toString(), manager]),
  );

  return users.map((user) => {
    const profile = profileByUser.get(user._id.toString());
    const manager = profile?.managerId
      ? managerById.get(profile.managerId.toString())
      : undefined;
    return {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      isActive: user.isActive !== false,
      department: profile?.department ?? "",
      jobTitle: profile?.jobTitle ?? "",
      workStatus: profile?.workStatus ?? "active",
      manager: manager
        ? { name: manager.fullName, email: manager.email }
        : null,
    };
  });
}

export async function getEmployeeSelf(userId: string) {
  const user = await User.findById(userId)
    .select("fullName email role isActive")
    .lean();
  if (!user || user.role !== "employee" || user.isActive === false) {
    throw new HttpError(
      404,
      "EMPLOYEE_NOT_FOUND",
      "Employee profile not found.",
    );
  }
  const profile = await EmployeeProfile.findOne({ userId: user._id })
    .select("department jobTitle managerId workStatus")
    .lean();
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    department: profile?.department ?? "",
    jobTitle: profile?.jobTitle ?? "",
    workStatus: profile?.workStatus ?? "active",
  };
}

export async function saveEmployeeProfile(input: EmployeeProfileUpsert) {
  const user = await User.findOne({
    _id: input.userId,
    role: "employee",
  })
    .select("_id")
    .lean();
  if (!user) {
    throw new HttpError(
      400,
      "INVALID_EMPLOYEE",
      "An active employee account is required.",
    );
  }
  await assertManagerAccount(input.managerId);
  const setValues: Record<string, unknown> = {
    department: input.department,
    jobTitle: input.jobTitle,
    workStatus: input.workStatus,
  };
  if (input.managerId !== undefined) {
    setValues.managerId = input.managerId
      ? new Types.ObjectId(input.managerId)
      : null;
  }
  const profile = await EmployeeProfile.findOneAndUpdate(
    { userId: input.userId },
    { $set: setValues },
    { new: true, upsert: true, runValidators: true },
  )
    .select("userId department jobTitle managerId workStatus")
    .lean();
  return profile;
}

export async function updateEmployeeProfile(
  userId: string,
  input: EmployeeProfileUpdate,
) {
  const profile = await EmployeeProfile.findOne({ userId });
  if (!profile) {
    throw new HttpError(
      404,
      "EMPLOYEE_PROFILE_NOT_FOUND",
      "Employee profile not found.",
    );
  }
  if (input.managerId !== undefined) {
    await assertManagerAccount(input.managerId);
  }
  if (input.department !== undefined) profile.department = input.department;
  if (input.jobTitle !== undefined) profile.jobTitle = input.jobTitle;
  if (input.managerId !== undefined) {
    profile.managerId = input.managerId
      ? new Types.ObjectId(input.managerId)
      : null;
  }
  if (input.workStatus !== undefined) profile.workStatus = input.workStatus;
  await profile.save();
  return profile;
}

export async function listProjects(actor: EmployeeActor) {
  const canReadAll =
    actor.permissions?.some((permission) =>
      ["projects:read", "projects:manage"].includes(permission),
    ) ?? false;
  const filter = canReadAll
    ? {}
    : {
        $or: [
          { ownerId: new Types.ObjectId(actor.id) },
          { memberIds: new Types.ObjectId(actor.id) },
        ],
      };
  const projects = await Project.find(filter).sort({ updatedAt: -1 }).lean();
  const memberIds = [
    ...new Set(
      projects.flatMap((project) => [
        project.ownerId.toString(),
        ...project.memberIds.map((id) => id.toString()),
      ]),
    ),
  ];
  const members = memberIds.length
    ? await User.find({ _id: { $in: accountObjectIds(memberIds) } })
        .select("fullName email")
        .lean()
    : [];
  const memberById = new Map(
    members.map((member) => [
      member._id.toString(),
      { id: member._id.toString(), name: member.fullName, email: member.email },
    ]),
  );
  return projects.map((project) => ({
    id: project._id.toString(),
    name: project.name,
    description: project.description,
    status: project.status,
    startDate: project.startDate,
    endDate: project.endDate,
    owner: memberById.get(project.ownerId.toString()) ?? null,
    members: project.memberIds.flatMap((id) => {
      const member = memberById.get(id.toString());
      return member ? [member] : [];
    }),
  }));
}

export async function createProject(input: ProjectCreate, actorId: string) {
  const ownerId = input.ownerId ?? actorId;
  await assertProjectAccounts(ownerId, input.memberIds);
  const project = await Project.create({
    ...input,
    ownerId: new Types.ObjectId(ownerId),
    memberIds: accountObjectIds(input.memberIds),
  });
  return project;
}

export async function updateProject(id: string, input: ProjectUpdate) {
  const project = await Project.findById(id);
  if (!project) {
    throw new HttpError(404, "PROJECT_NOT_FOUND", "Project not found.");
  }
  const ownerId = input.ownerId ?? project.ownerId.toString();
  const memberIds =
    input.memberIds ?? project.memberIds.map((item) => item.toString());
  if (input.ownerId !== undefined || input.memberIds !== undefined) {
    await assertProjectAccounts(ownerId, memberIds);
  }

  if (input.name !== undefined) project.name = input.name;
  if (input.description !== undefined) project.description = input.description;
  if (input.status !== undefined) project.status = input.status;
  if (input.ownerId !== undefined)
    project.ownerId = new Types.ObjectId(input.ownerId);
  if (input.memberIds !== undefined)
    project.memberIds = accountObjectIds(input.memberIds);
  if (input.startDate !== undefined) project.startDate = input.startDate;
  if (input.endDate !== undefined) project.endDate = input.endDate;
  if (
    project.startDate &&
    project.endDate &&
    project.endDate < project.startDate
  ) {
    throw new HttpError(
      400,
      "INVALID_PROJECT_DATES",
      "The end date must be on or after the start date.",
    );
  }
  await project.save();
  return project;
}

export async function getEmployeeReport() {
  const activeEmployeeUsers = await User.find({
    role: "employee",
    isActive: true,
  })
    .select("_id")
    .lean();
  const [departments, projects] = await Promise.all([
    EmployeeProfile.aggregate([
      {
        $match: {
          userId: { $in: activeEmployeeUsers.map((user) => user._id) },
        },
      },
      {
        $group: {
          _id: "$department",
          employees: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$workStatus", "active"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);
  return { departments, projects };
}
