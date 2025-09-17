import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Email } from "@convex-dev/auth/providers/Email";
import { action, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string,
        };
      },
      // Enable password reset via email one-time code
      reset: Email({
        async sendVerificationRequest(params) {
          const { identifier, token, url, expires } = params;
          const apiKey = process.env.RESEND_API_KEY;
          const fromEmail = process.env.FROM_EMAIL || "no-reply@example.com";

          const subject = "Your password reset code";
          const text = `You requested a password reset.\n\n` +
            `Code: ${token}\n` +
            `Or click the link: ${url}\n\n` +
            `This code/link expires at ${expires.toISOString()}. If you did not request this, you can ignore this email.`;

          if (!apiKey) {
            console.warn("RESEND_API_KEY not set. Logging reset email instead.");
            console.log(`[DEV] Send to: ${identifier} | Subject: ${subject} | Body: ${text}`);
            return;
          }

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromEmail,
              to: identifier,
              subject,
              text,
            }),
          });
        },
      }),
    }),
  ],
});

export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});

// Public actions to support "forgot password" flow

// Step 1: Request a password reset code to be emailed to the user
export const requestPasswordReset = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    // Triggers the Password provider "reset" flow -> sends email with code
    await ctx.runAction(api.auth.signIn, {
      provider: "password",
      params: { flow: "reset", email },
    });
    return { ok: true } as const;
  },
});

// Step 2: Verify the code and set a new password
export const resetPassword = action({
  args: {
    email: v.string(),
    code: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { email, code, newPassword }) => {
    await ctx.runAction(api.auth.signIn, {
      provider: "password",
      params: { flow: "reset-verification", email, code, newPassword },
    });
    return { ok: true } as const;
  },
});
