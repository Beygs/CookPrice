import successImg from "assets/images/ingredient_success.gif";
import Image from "next/image";
import formsStyles from "../Forms.module.scss";

const Success: React.FC = () => {
  return (
    <>
    <Image src={successImg} width={300} height={300} alt="Success Gif" />
    <div className={formsStyles.success}>Ingrédient ajouté !</div>
    </>
  )
}

export default Success;
