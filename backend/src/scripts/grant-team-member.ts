import mongoose from "mongoose";
import { connectToDatabase } from "../db/mongoose.js";
import { User } from "../modules/auth/user.model.js";

async function grantTeamRole() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Provide the email address of an existing team account.");
  }

  await connectToDatabase();
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { role: "staff" } },
      { new: true, runValidators: true },
    )
      .select("_id email role")
      .lean();
    if (!user) {
      throw new Error(
        "No account matches that email. Register the account before granting team access.",
      );
    }

    console.info(`Team assignment access granted to ${user.email}.`);
  } finally {
    await mongoose.disconnect();
  }
}

grantTeamRole().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
