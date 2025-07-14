const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");
import axios from "axios";
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

export{
    GetAllMenu,
    GetMenuById,
    GetAllMenuImage
}