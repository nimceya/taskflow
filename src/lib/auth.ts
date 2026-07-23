import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

// Exported so admin Server Actions can read/update the "user" collection
// directly (list users, ban/unban, delete) without going through Better
// Auth's public-facing API, which doesn't expose admin operations itself.
export { client, db };

/**
 * Better Auth manages its own collections (user, session, account, etc.)
 * through the Mongo native-driver adapter. This is separate from the
 * Mongoose connection in `db.ts`, which we use for our own Task model —
 * both point at the same Atlas cluster/database.
 */
export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh session if older than 1 day
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        // input: false means users can never set this themselves via the
        // sign-up form or client API — it can only be changed by us,
        // directly in the database (or through our admin actions).
        input: false,
      },
      banned: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },
});

