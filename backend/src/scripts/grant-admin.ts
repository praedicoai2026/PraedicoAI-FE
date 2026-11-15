import mongoose from "mongoose";
import { connectToDatabase } from "../db/mongoose.js";
import { User } from "../modules/auth/user.model.js";

async function grantAdminRole() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Provide the email address of an existing account.");
  }

  await connectToDatabase();
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { role: "admin" } },
      { new: true, runValidators: true },
    )
      .select("_id email role")
      .lean();

    if (!user) {
      throw new Error(
        "No account matches that email. Register the account before granting admin access.",
      );
    }

    console.info(`Admin access granted to ${user.email}.`);
  } finally {
    await mongoose.disconnect();
  }
}

grantAdminRole().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
