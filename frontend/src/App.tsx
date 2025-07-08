import React from "react";
import NutritionInput from "./pages/nutrition/NutritionInput";
import NutritionSuggestion from "./pages/nutrition/NutritionSuggestion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<NutritionInput />} />
        <Route path="/nutrition-suggestion" element={<NutritionSuggestion />} />
      </Routes>
    </Router>
  );
}

export default App;
