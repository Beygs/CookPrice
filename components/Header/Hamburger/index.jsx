import { hamburgerIconBtn, hamburgerIcon, active } from "./Hamburger.module.scss";
import { CroissantIcon } from "components/Icons";
import LoggedInMenu from "./LoggedInMenu";
import { useState } from "react";
import cn from "classnames";
import { useSession } from "components/hooks/useSession";
import LoggedOutMenu from "./LoggedOutMenu";

const Hamburger = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [session] = useSession();

  return (
    <>
      <button
        className={hamburgerIconBtn}
        onClick={() => setMenuOpened((prev) => !prev)}
      >
        <CroissantIcon
          className={cn(hamburgerIcon, {
            [active]: menuOpened,
          })}
        />
      </button>
      {session ? (

        <LoggedInMenu menuOpened={menuOpened} />
      ) : (
        <LoggedOutMenu menuOpened={menuOpened} />
      )

      }
    </>
  );
};

export default Hamburger;
