import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export const fetchSession = async () => {
  const res = await axios.get("/api/auth/session");
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
} = {}) => {
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
