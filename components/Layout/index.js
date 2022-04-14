import Header from "components/Header";
import React from "react";
import styles from "styles/Main.module.scss";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Layout;
