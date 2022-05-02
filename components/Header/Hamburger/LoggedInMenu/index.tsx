import cn from "classnames";
import { useSession } from "components/hooks/useSession";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "../Hamburger.module.scss";

interface Props {
  menuOpened: boolean;
  setMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoggedInMenu: React.FC<Props> = ({ menuOpened, setMenuOpened }) => {
  const { navItems, navItem, hamburgerMenu, active } = styles;
  const [session] = useSession();

  const imgSrc =
    typeof session === "boolean"
      ? undefined
      : `/api/imageproxy?url=${encodeURIComponent(session?.user?.image)}`;

  return (
    <ul
      className={cn(navItems, hamburgerMenu, {
        [active]: menuOpened,
      })}
    >
      <li className={navItem}>
        <Link href="/my-account">
          <a
            onClick={() => setMenuOpened(false)}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src={imgSrc}
              width={50}
              height={50}
              alt="Profile picture"
              style={{ borderRadius: "50%" }}
            />
            <p>&nbsp;Mon&nbsp;compte</p>
          </a>
        </Link>
      </li>
      <li className={navItem}>
        <Link href="/my-recipes">
          <a onClick={() => setMenuOpened(false)}>Mes&nbsp;recettes</a>
        </Link>
      </li>
      <li className={navItem}>
        <Link href="/my-ingredients">
          <a onClick={() => setMenuOpened(false)}>Mes&nbsp;ingrédients</a>
        </Link>
      </li>
      <li className={navItem}>
        <button
          onClick={() => {
            setMenuOpened(false);
            signOut();
          }}
        >
          Déconnexion
        </button>
      </li>
    </ul>
  );
};

export default LoggedInMenu;
