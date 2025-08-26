import type { FoodGroupInterface } from "./FoodGroup";

export interface FoodFlagInterface {
    ID?: number;
    Flag?: string;
    FoodGroupID?: number; //FK          
}

export type FoodFlagType = {
  ID: number;
  Flag: string;
  FoodGroup: FoodGroupInterface;
};