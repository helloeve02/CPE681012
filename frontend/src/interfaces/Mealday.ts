/* import type { MealplanInterface } from "./Mealplan";
import type { MealInterface } from "./Meal"; */
export interface MealdayInterface {
    ID?: number;
    DayofWeek?: string;
    MealplanID?: number; //FK
    /* Mealplans?: MealplanInterface[];
    Meals?: MealInterface[]; //   */         
}