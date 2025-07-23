import React from "react";
import NutritionInput from "./pages/Nutrition/NutritionInput";
import NutritionSuggestion from "./pages/Nutrition/NutritionSuggestion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu/menu"
import NavBar from "./components/NavBar";
import HomePage from "./pages/Home/HomePage";
import ChooseAvoid from "./pages/Nutrition/ChooseAvoid";
import MenuDetail from "./pages/Menu/menudetails";
import NewsCategoryPage from "./pages/KnowledgeNews/NewsCategoryPage";
import MediaNewsPage from "./pages/KnowledgeNews/Multimedia";
import InfographicNewsPage from "./pages/KnowledgeNews/Infographic";
import HealthAssessmentPage from "./pages/Assessment/AssessmentCategoryPage";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nutrition" element={<NutritionInput />} />
        <Route path="/nutrition-suggestion" element={<NutritionSuggestion />} />
        <Route path="/choose-avoid" element={<ChooseAvoid />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<MenuDetail />} />
        <Route path="/SelectNewsCategoryPage" element={<NewsCategoryPage  />} />
        <Route path="/MediaNewsPage" element={<MediaNewsPage  />} />
        <Route path="/InfographicNewsPage" element={<InfographicNewsPage  />} />
        <Route path="/SelectAssessmentCategoryPage" element={<HealthAssessmentPage  />} />
      </Routes>
    </Router>
  );
}

export default App;
