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
        },
      },
    }),
  ],
  adapter,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
