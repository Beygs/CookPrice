import Header from "components/Header";
import React from "react";
import styles from "styles/Main.module.scss";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Layout;
