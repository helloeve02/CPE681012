/* import type { MealdayInterface } from "./Mealday";
import type { MealMenuInterface } from './MealMenu'; */
export interface MealInterface {
    ID?: number;
    MealType?: string;
    MealdayID?: number; //FK 
    /* Mealdays?: MealdayInterface[];
    MealMenus?: MealMenuInterface[];     */        
}