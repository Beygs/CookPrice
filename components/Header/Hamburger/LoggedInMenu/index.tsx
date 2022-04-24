import cn from "classnames";
import { useSession } from "components/hooks/useSession";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { navItems, hamburgerMenu, active } from "../Hamburger.module.scss";

interface Props {
  menuOpened: boolean;
  setMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoggedInMenu: React.FC<Props> = ({ menuOpened, setMenuOpened }) => {
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
      <li>
        <Link href="/my-account">
          <a onClick={() => setMenuOpened(false)}>
            <Image
              src={imgSrc}
              width="20px"
              height="20px"
              alt="Profile picture"
            />
            Mon&nbsp;compte
          </a>
        </Link>
      </li>
      <li>
        <Link href="/my-recipes">
          <a onClick={() => setMenuOpened(false)}>Mes&nbsp;recettes</a>
        </Link>
      </li>
      <li>
        <Link href="/my-ingredients">
          <a onClick={() => setMenuOpened(false)}>Mes&nbsp;ingrédients</a>
        </Link>
      </li>
      <li>
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
