import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Menu from "./pages/Menu/menu";
import NavBar from "./components/NavBar";
import MenuDetail from "./pages/Menu/menudetails";
import NewsCategoryPage from "./pages/KnowledgeNews/NewsCategoryPage";
import MediaNewsPage from "./pages/KnowledgeNews/Multimedia";
import InfographicNewsPage from "./pages/KnowledgeNews/Infographic";
import HealthAssessmentPage from "./pages/Assessment/AssessmentCategoryPage";
import BMICalculator from "./pages/Assessment/BMI/BMI";
import GeneralHealthIntroPage from "./pages/Assessment/BMI/InformationBMI";
import BMICalculatorResultPage from "./pages/Assessment/BMI/BMICalculatorResultPage";
import SelectAgeRange from "./pages/Assessment/Diabetes/SelectAge";
import DiabetesMoreAssessmentPage from "./pages/Assessment/Diabetes/More";
import DiabetesLessAssessmentPage from "./pages/Assessment/Diabetes/Less";
import KidneyriskAssessmentPage from "./pages/Assessment/Kidney/Kidney";
import MealPlannerApp from "./pages/Plan/Mealplan";
import HomePage from "./pages/Home/HomePage";
import NutritionInput from "./pages/Nutrition/NutritionInput";
import NutritionSuggestion from "./pages/Nutrition/NutritionSuggestion";
import ChooseAvoid from "./pages/Nutrition/ChooseAvoid";
import PDFViewerPage from "./pages/Nutrition/PDFViewerPage";
// import LoginSignupPage from "./pages/Admin/admin";
// import ForgotPasswordPage from "./pages/Admin/forgorpass"

const AppContent = () => {
  const location = useLocation();

  // เช็คว่าไม่ใช่หน้า admin ค่อยแสดง NavBar
  const hideNavBar = ["/admin", "/pdf-viewer"].includes(location.pathname);

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nutrition" element={<NutritionInput />} />
        <Route path="/nutrition-suggestion" element={<NutritionSuggestion />} />
        <Route path="/choose-avoid" element={<ChooseAvoid />} />
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
        <Route path="/assessment/diabeteslessassessmentpage" element={<DiabetesLessAssessmentPage />} />
        <Route path="/assessment/kidneyriskassessmentpage" element={<KidneyriskAssessmentPage />} />
        <Route path="/mealplanner" element={<MealPlannerApp />} />
        <Route path="/pdf-viewer" element={<PDFViewerPage />} />
        {/* <Route path="/admin" element={<LoginSignupPage />} />
        <Route path="/forgot-pass" element={<ForgotPasswordPage />} /> */}
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
