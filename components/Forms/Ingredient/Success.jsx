import successImg from "assets/images/ingredient_success.gif";
import Image from "next/image";
import { success } from "./Ingredient.module.scss";

const Success = () => {
  return (
    <>
    <Image src={successImg} width={300} height={300} alt="Success Gif" />
    <div className={success}>Ingrédient ajouté !</div>
    </>
  )
}

export default Success;
