/* import type { MealInterface } from "./Meal";
import type { MenuInterface } from "./Menu"; */
export interface MealMenuInterface {
    ID?: number;
    MenuType?: string;
    PortionText?: string;
    MealID?: number; //FK
    MenuID?: number; //FK
    /* Menus?: MenuInterface[];  */
    /* Menu?: MenuInterface; 
    Meals?: MealInterface[];  */               
}