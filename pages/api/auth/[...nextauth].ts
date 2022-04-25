import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "lib/prismaClient";
import { Session } from "next-auth";
import NextAuth from "next-auth/next";
import Email from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      session = {
        ...session,
        user,
      };
      return Promise.resolve(session);
    },
  },
});
