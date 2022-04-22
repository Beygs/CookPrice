import axios from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useQuery, UseQueryOptions } from "react-query";

interface Params {
  required?: boolean;
  redirectTo?: string;
  queryConfig?: UseQueryOptions<Session | null>
}

export const fetchSession = async (): Promise<Session | null> => {
  const res = await axios.get<Session>("/api/auth/session");
  const session = res.data;
  if (Object.keys(session).length) {
    return session;
  }
  return null;
};

export const useSession = ({
  required,
  redirectTo = "/api/auth/signin?error=SessionExpired",
  queryConfig = {},
}: Params = {}) => {
  const router = useRouter();
  const query = useQuery(["session"], fetchSession, {
    ...queryConfig,
    onSettled(data, error) {
      if (queryConfig.onSettled) queryConfig.onSettled(data, error);
      if (data || !required) return;
      router.push(redirectTo);
    },
  });
  return [query.data, query.status === "loading"];
};
