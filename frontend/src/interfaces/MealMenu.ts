/* import type { MealInterface } from "./Meal";
import type { MenuInterface } from "./Menu"; */
export interface MealMenuInterface {
    ID?: number;
    /* MenuType?: string; */
    PortionText?: string;
    MealID?: number; //FK
    MenuID?: number; //FK
    isFoodItem?: boolean; // เพื่อแยกว่าเป็น FoodItem หรือ Menu
    isSpecialDessert?: boolean; // สำหรับของหวานพิเศษของโรคเบาหวาน
    TargetID?: number; // ใช้เป็น id สำหรับ navigate
    /* Menus?: MenuInterface[];  */
    /* Menu?: MenuInterface; 
    Meals?: MealInterface[];  */               
}