import React from "react";
import NutritionInput from "./pages/nutrition/NutritionInput";
import NutritionSuggestion from "./pages/nutrition/NutritionSuggestion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu/menu"
import NavBar from "./components/NavBar";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nutrition" element={<NutritionInput />} />
        <Route path="/nutrition-suggestion" element={<NutritionSuggestion />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  );
}

export default App;
