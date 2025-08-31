/* export interface FoodchoiceDiseaseInterface {
    ID?: number;
    Description?: string;
    DiseaseID?: number; //FK
    FoodChoiceID?: number; //FK       
} */

export interface FoodchoiceDiseaseInterface {
  ID?: number;
  DiseaseID: number;
  FoodChoiceID: number;
  Description: string;
  FoodChoice?: {
    ID: number;
    FoodName: string;
  };
  Disease?: {
    ID: number;
    Name: string;
    Stage: string;
  };
}