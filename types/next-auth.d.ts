import nextAuth, { DefaultSession, Session } from "next-auth";
import { UseQueryOptions } from "react-query"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      gazPrice?: number;
      electricityPrice?: number;
      deliveryPrice?: number;
    } & DefaultSession["user"]
  }
}
