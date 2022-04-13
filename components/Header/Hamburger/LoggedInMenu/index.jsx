import cn from "classnames";
import { useSession } from "components/hooks/useSession";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { navItems, hamburgerMenu, active } from "../Hamburger.module.scss";

const LoggedInMenu = ({ menuOpened }) => {
  const [session] = useSession();

  return (
    <ul
      className={cn(navItems, hamburgerMenu, {
        [active]: menuOpened,
      })}
    >
      <li>
        <Link href="my-account">
          <a>
            <Image
              src={`/api/imageproxy?url=${encodeURIComponent(
                session?.user?.image
              )}`}
              width="20px"
              height="20px"
              alt="Profile picture"
            />
            Mon compte
          </a>
        </Link>
      </li>
      <li>
        <Link href="my-recipes">
          <a>Mes recettes</a>
        </Link>
      </li>
      <li>
        <Link href="my-ingredients">
          <a>Mes ingrédients</a>
        </Link>
      </li>
      <li>
        <button onClick={() => signOut()}>Déconnexion</button>
      </li>
    </ul>
  );
};

export default LoggedInMenu;
