import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { adapter } from "@/lib/mongo_adapter";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, account }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - Account:", account);
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - Token:", token);

      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.expiresAt = token.expiresAt as number;
      return session;
    },
  },
  adapter,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
