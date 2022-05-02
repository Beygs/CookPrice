import "styles/globals.scss";
import "styles/reset.scss";
import "styles/react-datalist-input.scss";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import { ReactNode } from "react";
import { NextComponentType } from "next";
import AppLayout from "components/Layout/AppLayout";

const queryClient = new QueryClient();

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppLayoutProps) => {
  const getLayout = Component.getLayout || ((page: ReactNode) => (
    <AppLayout>
      {page}
    </AppLayout>
  ));
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
        <ReactQueryDevtools />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
