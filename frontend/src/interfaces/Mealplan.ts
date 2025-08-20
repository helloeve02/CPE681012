/* import type { DiseaseInterface } from './Disease';
import type{ MealdayInterface } from './Mealday'; */
export interface MealplanInterface {
    ID?: number;
    PlanName?: string;
    AdminID?: number; //FK
    /* DiseaseID?: number; //FK */
    /* Disease?: DiseaseInterface; */
    /* Mealdays?: MealdayInterface[];    */           
}