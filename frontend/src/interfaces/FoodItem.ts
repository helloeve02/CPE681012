import type { FoodFlagType } from "./FoodFlag";

export interface FoodItemInterface {
    ID?: number;
    Name?: string;
    Image?: string;
    Credit?: string;
    Description?: string;
    FoodFlagID?: number; //FK          
}

export type FoodItem = {
  ID: number;
  Name: string;
  Image: string;
  Credit: string;
  Description: string;
  FoodFlag: FoodFlagType;
};