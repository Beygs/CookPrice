import { useRouter } from "next/router";
import React from "react";
import styles from "./BackLink.module.scss";

const BackLink: React.FC = () => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    router.back();
  };

  return (
    <button type="button" className={styles.backLink} onClick={handleClick}>
      Retour
    </button>
  );
};

export default BackLink;
