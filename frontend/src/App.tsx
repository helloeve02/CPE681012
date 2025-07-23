import React from "react";
import NutritionInput from "./pages/nutrition/NutritionInput";
import NutritionSuggestion from "./pages/nutrition/NutritionSuggestion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu/menu"
import NavBar from "./components/NavBar";
import HomePage from "./pages/Home/HomePage";
import MenuDetail from "./pages/Menu/Menudetails"
import NewsCategoryPage from "./pages/Knowledge_News/NewsCategoryPage";
import MediaNewsPage from "./pages/Knowledge_News/Multimedia";
import InfographicNewsPage from "./pages/Knowledge_News/Infographic";
import HealthAssessmentPage from "./pages/Assessment/AssessmentCategoryPage";
import BMICalculator from "./pages/Assessment/BMI/BMI";
import GeneralHealthIntroPage from "./pages/Assessment/BMI/InformationBMI";
import BMICalculatorResultPage from "./pages/Assessment/BMI/BMICalculatorResultPage";
import SelectAgeRange from "./pages/Assessment/Diabetes/SelectAge";
import DiabetesMoreAssessmentPage from "./pages/Assessment/Diabetes/More";


function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nutrition" element={<NutritionInput />} />
        <Route path="/nutrition-suggestion" element={<NutritionSuggestion />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<MenuDetail />} />
        <Route path="/selectnewscategorypage" element={<NewsCategoryPage />} />
        <Route path="/medianewspage" element={<MediaNewsPage />} />
        <Route path="/infographicnewspage" element={<InfographicNewsPage />} />
        <Route path="/selectassessmentcategorypage" element={<HealthAssessmentPage />} />
        <Route path="/assessment/information/bmi" element={<GeneralHealthIntroPage />} />
        <Route path="/assessment/bmi" element={<BMICalculator />} />
        <Route path="/assessment/bmiresult" element={<BMICalculatorResultPage />} />
        <Route path="/assessment/selectagerange" element={<SelectAgeRange />} />
        <Route path="/assessment/diabetesmoreassessmentpage" element={<DiabetesMoreAssessmentPage />} />


      </Routes>
    </Router>
  );
}

export default App;
