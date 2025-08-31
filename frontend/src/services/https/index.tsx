const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");
import axios from "axios";
import type { UserInfo } from "../../interfaces/Nutrition";
import type { AdminInterface } from "../../interfaces/Admin";
import type { MenuInterface } from "../../interfaces/Menu";
import type { FoodItemInterface } from "../../interfaces/FoodItem";
const requestOptions = {
  headers: {
    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function GetAllMenu() {
  return await axios
    .get(`${apiUrl}/menu`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMenuById(id: string) {
  return await axios
    .get(`${apiUrl}/menu/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function GetAllMenuImage() {
  return await axios
    .get(`${apiUrl}/menuimage`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

//==================================Nutrition START======================================⏬

async function GetAllDisease() {
  return await axios
    .get(`${apiUrl}/diseases`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function FindRuleByUserInfo(userInfo: UserInfo) {
  return await axios
    .post(`${apiUrl}/rule`, userInfo)
    .then((res) => res.data)
    .catch((e) => {
      console.error("Error fetching rule:", e.response?.data || e.message);
      return null;
    });
}

async function GetNutritionDataByRule(rule: number) {
  return await axios
    .get(`${apiUrl}/nutritionrecommendation/${rule}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPortionDataByRule(rule: number) {
  return await axios
    .get(`${apiUrl}/portionrecommendation/${rule}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetCaloriesByRule(rule: number) {
  return await axios
    .get(`${apiUrl}/calories/${rule}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetRuleDetailByRule(rule: number) {
  return await axios
    .get(`${apiUrl}/ruledetail/${rule}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAllChooseAvoid() {
  return await axios
    .get(`${apiUrl}/food-item-with-data`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


//==================================Nutrition END======================================⏬

async function GetAllIngredients() {
  return await axios
    .get(`${apiUrl}/ingredients`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetIngredientsByID(id: string) {
  return await axios
    .get(`${apiUrl}/ingredients/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

//==================================Login======================================⏬
async function SignIn(data: AdminInterface) {
  return await axios

    .post(`${apiUrl}/signin`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}
//signus
async function CreateUser(data: AdminInterface) {
  return await axios

    .post(`${apiUrl}/signup`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}
// ResetPassword
async function ResetPassword(data: AdminInterface) {
  return await axios

    .put(`${apiUrl}/ResetPasswordUser`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

//==================================Login======================================⏫

//=====================================================User===================================================
// get User by id
async function GetUserById(id: string) {
  return await axios

    .get(`${apiUrl}/users/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}
async function DeleteUserByID(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE",
  };

  let res = await fetch(`${apiUrl}/users/${id}`, requestOptions).then((res) => {
    if (res.status == 200) {
      return true;
    } else {
      return false;
    }
  });

  return res;
}
// update user
async function UpdateUserByid(id: string, data: AdminInterface) {
  return await axios

    .put(`${apiUrl}/users/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

//ไม่ได้ใช้
async function UpdateUser(data: AdminInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/users`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function GetAllTag() {
  return await axios
    .get(`${apiUrl}/tag`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetTagByID(id: string) {
  return await axios
    .get(`${apiUrl}/tag/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function GetAllMenuTag() {
  return await axios
    .get(`${apiUrl}/menu-tag`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMenuTagByID(id: string) {
  return await axios
    .get(`${apiUrl}/menu-tag/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function GetAllFoodFlags() {
  return await axios
    .get(`${apiUrl}/food-flag`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAllFoodItems() {
  return await axios
    .get(`${apiUrl}/food-item`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
//=======================================foodgroup==============================================//

async function GetAllFoodGroups() {
  return await axios
    .get(`${apiUrl}/food-group`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetFoodGroupByID(id: string) {
  return await axios
    .get(`${apiUrl}/food-group/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function GetFoodItemsByFlags() {
  return await axios
    .get(`${apiUrl}/foods/flags`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateMenu(menuInfo: MenuInterface) {
  return await axios
    .post(`${apiUrl}/menu`, menuInfo)
    .then((res) => res.data)
    .catch((e) => {
      console.error("Error fetching menu:", e.response?.data || e.message);
      return null;
    });
}

async function UpdateMenu(id: number, data: MenuInterface) {
  return await axios
    .patch(`${apiUrl}/menu/${id}`, data)
    .then(res => res)
    .catch(e => e.response);
}

async function DeleteMenu(id: number | undefined) {
  return await axios
    .delete(`${apiUrl}/menu/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateFoodItem(data: FoodItemInterface) {
  return await axios
    .post(`${apiUrl}/food-item`, data)
    .then((res) => res.data)
    .catch((e) => {
      console.error("Error fetching food item:", e.response?.data || e.message);
      return null;
    });
}

async function DeleteFoodItem(id: number | undefined) {
  return await axios
    .delete(`${apiUrl}/food-item/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

//=======================================MealPlan==============================================//
// Generate weekly meal plan (POST)
async function GenerateWeeklyMealPlan(data: { diseaseID: number, tagIDs: number[] }) {
  return await axios
    .post(`${apiUrl}/weekly-mealplan/generate`, data, requestOptions)
    .then((res) => res.data)
    .catch((e) => {
      console.error("Error generating meal plan:", e.response?.data || e.message);
      return null;
    });
}

async function GetMealplansByDisease(diseaseID: number) {
  return await axios
    .get(`${apiUrl}/mealplans/by-disease/${diseaseID}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => {
      console.error("Error fetching mealplans by disease:", e.response?.data || e.message);
      return null;
    });
}

async function GetFoodItemByID(id: string) {
  return await axios
    .get(`${apiUrl}/fooditem/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

// ดึงคำแนะนำทั้งหมด
async function GetAllFoodChoices() {
  return await axios
    .get(`${apiUrl}/foodchoices`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ดึงคำแนะนำตามโรค
async function GetFoodChoicesByDiseaseID(diseaseID: number) {
  return await axios
    .get(`${apiUrl}/foodchoices/disease/${diseaseID}`, requestOptions)
    .then((res) => res.data.data) // เดิมคืน res -> แก้เป็นอ่าน payload จริง
    .catch((e) => e.response);
}
// ดึงเมนูมื้อหลักตาม Tag IDs (POST)
async function GetMenusByTagIDs(tagIDs: number[]) {
  return await axios
    .post(`${apiUrl}/menus/by-tags`, { tagIDs }, requestOptions)
    .then((res) => res.data.menus)
    .catch((e) => {
      console.error("Error fetching menus by tags:", e.response?.data || e.message);
      return [];
    });
}

// ดึงผลไม้ที่ควรรับประทาน (GET)
/* async function GetFruits() {
  return await axios
    .get(`${apiUrl}/fooditems/flag3`, requestOptions)
    .then((res) => res.data.fooditems)
    .catch((e) => {
      console.error("Error fetching fruits:", e.response?.data || e.message);
      return [];
    });
}
 */

// services/https/index.ts
async function GetFruits() {
  return await axios
    .get(`${apiUrl}/fruits`, requestOptions)
    .then((res) => res?.data?.fruits ?? res?.data?.fooditems ?? []) // <= รองรับทั้ง fruits/fooditems
    .catch((e) => {
      console.error("Error fetching fruits:", e?.response?.data || e.message);
      return [];
    });
}
// ดึงของหวานทั่วไป (GET)
async function GetDesserts() {
  return await axios
    .get(`${apiUrl}/desserts`, requestOptions)
    .then((res) => res.data.desserts)
    .catch((e) => {
      console.error("Error fetching desserts:", e.response?.data || e.message);
      return [];
    });
}

// ดึงของหวานสำหรับโรคเบาหวาน (GET)
async function GetDiabeticDesserts() {
  return await axios
    .get(`${apiUrl}/desserts/diabetic`, requestOptions)
    .then((res) => res.data.diabeticDesserts)
    .catch((e) => {
      console.error("Error fetching diabetic desserts:", e.response?.data || e.message);
      return [];
    });
}
//=======================================Content==============================================//

async function GetAllContent() {
  return await axios
    .get(`${apiUrl}/content`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetContentByID(id: string) {
  return await axios
    .get(`${apiUrl}/content/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function DeleteContent(id: number | undefined) {
  return await axios
    .delete(`${apiUrl}/content/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateContent(data: FoodItemInterface) {
  return await axios
    .post(`${apiUrl}/content`, data)
    .then((res) => res.data)
    .catch((e) => {
      console.error("Error fetching food item:", e.response?.data || e.message);
      return null;
    });
}

async function GetAllCategory() {
  return await axios
    .get(`${apiUrl}/content-cat`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetContentCatByID(id: string) {
  return await axios
    .get(`${apiUrl}/content-cat/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function DeleteContentCat(id: number | undefined) {
  return await axios
    .delete(`${apiUrl}/content-cat/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetAllGroupContent() {
  return await axios
    .get(`${apiUrl}/content-group`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetGroupContentByID(id: string) {
  return await axios
    .get(`${apiUrl}/content-group/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function DeleteGroupContent(id: number | undefined) {
  return await axios
    .delete(`${apiUrl}/content-group/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetContentByInfographics() {
  return await axios
    .get(`${apiUrl}/content-infographics`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetContentByVideo() {
  return await axios
    .get(`${apiUrl}/content-video`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetContentByArticle() {
  return await axios
    .get(`${apiUrl}/content-article`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetContentAllByKidney() {
  return await axios
    .get(`${apiUrl}/content-kidney`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetContentAllByDiabetes() {
  return await axios
    .get(`${apiUrl}/content-diabetes`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetContentAllByExercise() {
  return await axios
    .get(`${apiUrl}/content-exercise`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetContentAllByNutrition() {
  return await axios
    .get(`${apiUrl}/content-nutrition`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// นับจำนวนเมนูทั้งหมด
async function GetMenuCount() {
  return await GetAllMenu()
    .then((res) => (res && res.data ? res.data.length : 0))
    .catch((e) => {
      console.error("Error counting menus:", e.response?.data || e.message);
      return 0;
    });
}

// นับจำนวน Content ทั้งหมด
async function GetContentCount() {
  return await GetAllContent()
    .then((res) => (res && res.data ? res.data.length : 0))
    .catch((e) => {
      console.error("Error counting contents:", e.response?.data || e.message);
      return 0;
    });
}

// นับจำนวน Food Item ทั้งหมด
async function GetFoodItemCount() {
  return await GetAllFoodItems()
    .then((res) => (res && res.data ? res.data.length : 0))
    .catch((e) => {
      console.error("Error counting food items:", e.response?.data || e.message);
      return 0;
    });
}

// นับจำนวน Disease ทั้งหมด
async function GetDiseaseCount() {
  return await GetAllDisease()
    .then((res) => (res && res.data ? res.data.length : 0))
    .catch((e) => {
      console.error("Error counting diseases:", e.response?.data || e.message);
      return 0;
    });
}

export {
  GetAllMenu,
  GetMenuById,
  GetAllMenuImage,
  GetAllDisease,
  FindRuleByUserInfo,
  GetNutritionDataByRule,
  GetPortionDataByRule,
  GetCaloriesByRule,
  GetRuleDetailByRule,
  GetAllIngredients,
  GetIngredientsByID,
  SignIn,
  CreateUser,
  ResetPassword,
  GetUserById,
  DeleteUserByID,
  UpdateUserByid,
  UpdateUser,
  GetAllTag,
  GetTagByID,
  GetAllMenuTag,
  GetMenuTagByID,
  GetAllFoodFlags,
  GetAllFoodItems,
  GetFoodGroupByID,
  GetAllFoodGroups,
  GetFoodItemsByFlags,
  CreateMenu,
  UpdateMenu,
  GenerateWeeklyMealPlan,
  GetMealplansByDisease,
  GetFoodItemByID,
  GetAllFoodChoices,
  GetFoodChoicesByDiseaseID,
  GetMenusByTagIDs, //ดึงตามtagที่ผู้ใช้เลือก
  GetFruits,
  GetDesserts,
  GetDiabeticDesserts, //ดึงของหวานโรคเบหวาน
  DeleteMenu,
  CreateFoodItem,
  DeleteFoodItem,
  GetAllContent,
  GetContentByID,
  DeleteContent,
  CreateContent,
  GetAllCategory,
  GetContentCatByID,
  DeleteContentCat,
  GetAllGroupContent,
  GetGroupContentByID,
  DeleteGroupContent,
  GetContentByInfographics,
  GetContentByVideo,
  GetContentByArticle,
  GetAllChooseAvoid,
  GetContentAllByKidney,
  GetContentAllByDiabetes,
  GetContentAllByExercise,
  GetContentAllByNutrition,
  GetMenuCount,
  GetContentCount,
  GetFoodItemCount,
  GetDiseaseCount,

}