const IngredientInfos = ({ nextStep, handleChange, values }) => {
  const { name, price, unit, ingredients } = values;

  const handleNameChange = (e) => {
    const ingredientNames = ingredients.map((ingredient) => ingredient.name);
    const value = e.target.value;

    handleChange("name")(e);

    if (ingredientNames.includes(value)) console.log("coucou");;
  }

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (/^(\d*\.)?\d*$/.test(value)) handleChange("price")(e);
  }

  const handleNext = (e) => {
    e.preventDefault();
    nextStep();
  }

  return (
    <form>
      <input
        type="text"
        value={name}
        placeholder="Nom de l'ingrédient"
        onChange={handleNameChange}
      />
      <input
        type="text"
        value={price}
        placeholder="Prix"
        onChange={handleQuantityChange}
      />
      /
      <select value={unit} onChange={handleChange("unit")}>
        <option value="kg">kg</option>
        <option value="L">L</option>
        <option value="unité">unité</option>
      </select>
      <button onClick={handleNext}>Suivant</button>
    </form>
  );
};

export default IngredientInfos;
