export interface UserInfo {
  age: number;
  height: number;
  gender: string;
  disease_stage: string;
}

export interface NutritionData {
  nutrition_group_name: string;
  amount_in_grams: number;
  amount_in_percentage: number;
}

export interface PortionData {
  food_group_name: string;
  unit: string;
  meal_time_name: string;
  amount: number;
}

export interface RuleData {
  DiseaseName: string;
  DiseaseStage: string;
  AgeMin: number;
  AgeMax: number;
  IBWMin: number;
  IBWMax: number;
}

