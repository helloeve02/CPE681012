export interface MealMenuInterface {
    ID?: number;
    MenuType?: string;
    Portiontext?: string;
    MealID?: number; //FK
    MenuID?: number; //FK              
}