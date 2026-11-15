import mongoose from "mongoose";
import { connectToDatabase } from "../db/mongoose.js";
import { User } from "../modules/auth/user.model.js";

async function setupInitialSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Set SUPER_ADMIN_EMAIL to an existing account email.");
  }
  if (
    process.env.SUPER_ADMIN_SETUP_CONFIRMATION !==
    "CREATE_INITIAL_SUPER_ADMIN"
  ) {
    throw new Error(
      "Set SUPER_ADMIN_SETUP_CONFIRMATION=CREATE_INITIAL_SUPER_ADMIN to confirm this one-time setup.",
    );
  }

  await connectToDatabase();
  try {
    if (await User.exists({ role: "super_admin" })) {
      throw new Error(
        "A Super Admin already exists. This setup command can run only once.",
      );
    }

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: { role: "super_admin", isActive: true },
        $unset: { permissions: 1 },
      },
      { new: true, runValidators: true },
    )
      .select("_id email role")
      .lean();
    if (!user) {
      throw new Error(
        "No account matches SUPER_ADMIN_EMAIL. Register that account before running setup.",
      );
    }

    console.info(`Initial Super Admin configured for ${user.email}.`);
  } finally {
    await mongoose.disconnect();
  }
}

setupInitialSuperAdmin().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
