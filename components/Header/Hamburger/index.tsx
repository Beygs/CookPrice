import styles from "./Hamburger.module.scss";
import { CroissantIcon } from "components/Icons";
import LoggedInMenu from "./LoggedInMenu";
import { useState } from "react";
import cn from "classnames";
import { useSession } from "components/hooks/useSession";
import LoggedOutMenu from "./LoggedOutMenu";

const Hamburger: React.FC = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [session] = useSession();

  const {
    hamburgerContainer,
    hamburgerIconBtn,
    hamburgerIcon,
    active,
    blocker,
  } = styles;

  return (
    <div className={hamburgerContainer}>
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
        <>
          <div
            className={cn(blocker, {
              [active]: menuOpened,
            })}
            onClick={() => setMenuOpened(false)}
          />
          <LoggedInMenu menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
        </>
      ) : (
        <>
          <div
            className={cn(blocker, {
              [active]: menuOpened,
            })}
            onClick={() => setMenuOpened(false)}
          />
          <LoggedOutMenu menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
        </>
      )}
    </div>
  );
};

export default Hamburger;
