import { useRouter } from "next/router";
import { backLink } from "./BackLink.module.scss";

const BackLink = () => {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();

    router.back();
  };

  return (
    <button type="button" className={backLink} onClick={handleClick}>
      Retour
    </button>
  );
};

export default BackLink;
