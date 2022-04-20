import { capitalize } from "lib/utils";
import { Component } from "react";
import Allergens from "./Allergens";
import IngredientInfos from "./IngredientInfos";
import Success from "./Success";

export default class Ingredient extends Component {
  state = {
    step: 0,
    name: this.props.name ?? "",
    price: "",
    unit: "kg",
    allergens: this.props.allergens.map((allergen) => ({
      id: allergen.id,
      name: allergen.name,
      presence: "none",
    })),
    ingredients: this.props.ingredients,
    setName: this.props.setName,
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };

  handleChange = (input) => (e) => {
    const value =
      input === "name" ? capitalize(e.target.value) : e.target.value;
    this.setState({ [input]: value });
  };

  handleAllergenChange = (id, type) => (e) => {
    const allergensClone = JSON.parse(JSON.stringify(this.state.allergens));
    const allergenId = allergensClone.findIndex(
      (allergen) => allergen.id === id
    );

    allergensClone[allergenId].presence = e.target.checked ? type : "none";

    this.setState({
      allergens: allergensClone,
    });
  };

  render() {
    const { step, name, price, unit, allergens, ingredients, setName } = this.state;
    const values = {
      name,
      price,
      unit,
      allergens,
      ingredients,
      setName,
    };

    switch (step) {
      case 0: {
        return (
          <IngredientInfos
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      }
      case 1: {
        return (
          <Allergens
            prevStep={this.prevStep}
            nextStep={this.nextStep}
            handleAllergenChange={this.handleAllergenChange}
            values={values}
          />
        );
      }
      case 2: {
        return <Success />;
      }
      default: {
        break;
      }
    }
  }
}
