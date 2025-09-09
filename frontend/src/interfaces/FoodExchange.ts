export interface FoodExchangeInterface {
  ID?: number;
  Amount?: string;
  Unit?: string;
  FoodItem?: {
    Name?: string;
    Image?: string;
    Credit?: string;
    FoodFlag?: {
      FoodGroup?: {
        Name?: string;
        Unit?: string;
      };
    };
  };
}
