export const unitConverter = (quantity: number, unit: string): number => {
  switch (unit) {
    case ("unités"): {
      return quantity;
    }
    case ("mg"): {
      return quantity * 0.000001;
    }
    case ("g"): {
      return quantity * 0.001;
    }
    case ("kg"): {
      return quantity;
    }
    case ("ml"): {
      return quantity * 0.001;
    }
    case ("cl"): {
      return quantity * 0.01;
    }
    case ("dl"): {
      return quantity * 0.1;
    }
    case ("L"): {
      return quantity;
    }
    default: {
      throw new Error("Unité inconnue !");
    }
  }
}
