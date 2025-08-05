const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");
import axios from "axios";
import type { UserInfo } from "../../interfaces/Nutrition";
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

export{
    GetAllMenu,
    GetMenuById,
    GetAllMenuImage,
    GetAllDisease,
    FindRuleByUserInfo,
    GetNutritionDataByRule,
    GetPortionDataByRule,
    GetCaloriesByRule,
}