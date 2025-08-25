import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleIconClick = () => {
    navigate("/");
    console.log("Navigate to home");
  };

  const handleMenuClick = () => {
    navigate("/menu");
    console.log("Navigate to menu");
  };

  const handleNutritionClick = () => {
    navigate("/nutrition");
    console.log("Navigate to nutrition");
  };

  const handleNutritionSuggestionClick = () => {
    navigate("/nutrition-suggestion");
    console.log("Navigate to nutrition suggestion");
  };

  const handleMealPlanClick = () => {
    navigate("/mealplanner");
    console.log("Navigate to meal planner");
  };

  const handleKnowledgeClick = () => {
    console.log("Navigate to knowledge");
  };

  return (
    <nav className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-xl font-kanit">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            onClick={handleIconClick}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="bg-white bg-opacity-20 p-2 rounded-xl group-hover:bg-opacity-30 transition-all duration-300">
              <div className="w-8 h-8 text-white flex items-center justify-center font-bold text-lg">
                N
              </div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold group-hover:text-blue-100 transition-colors duration-300">
                NutriApp
              </div>
              <div className="text-xs text-blue-100 -mt-1">Health Dashboard</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={handleNutritionClick}
              className="px-4 py-2 rounded-xl text-white hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-blue-300 hover:border-opacity-50"
            >
              <span className="text-sm font-medium whitespace-nowrap">
                โภชนาการที่เหมาะกับคุณ
              </span>
            </button>
            
            <button
              onClick={handleNutritionSuggestionClick}
              className="px-4 py-2 rounded-xl text-white hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-blue-300 hover:border-opacity-50"
            >
              <span className="text-sm font-medium whitespace-nowrap">
                ปริมาณที่ควรทาน
              </span>
            </button>
            
            <button
              onClick={handleKnowledgeClick}
              className="px-4 py-2 rounded-xl text-white hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-blue-300 hover:border-opacity-50"
            >
              <span className="text-sm font-medium whitespace-nowrap">
                ความรู้
              </span>
            </button>
            
            <button
              onClick={handleMenuClick}
              className="px-4 py-2 rounded-xl text-white hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-blue-300 hover:border-opacity-50"
            >
              <span className="text-sm font-medium whitespace-nowrap">
                เมนูอาหารแนะนำ
              </span>
            </button>
            
            <button
              onClick={handleMealPlanClick}
              className="px-4 py-2 rounded-xl text-white hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-blue-300 hover:border-opacity-50"
            >
              <span className="text-sm font-medium whitespace-nowrap">
                แผนมื้ออาหาร
              </span>
            </button>
          </div>

          <button
            className="lg:hidden p-2 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
            onClick={toggleMenu}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'}`}></div>
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'mb-1'}`}></div>
              <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-2">
            <button
              onClick={() => {
                handleNutritionClick();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl text-white hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300 text-left border border-transparent hover:border-blue-300 hover:border-opacity-50"
            >
              <span className="font-medium">โภชนาการที่เหมาะกับคุณ</span>
            </button>
            
            <button
              onClick={() => {
                handleNutritionSuggestionClick();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl text-white hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300 text-left border border-transparent hover:border-blue-300 hover:border-opacity-50"
            >
              <span className="font-medium">ปริมาณที่ควรทาน</span>
            </button>
            
            <button
              onClick={() => {
                handleKnowledgeClick();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl text-white hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300 text-left border border-transparent hover:border-blue-300 hover:border-opacity-50"
            >
              <span className="font-medium">ความรู้</span>
            </button>
            
            <button
              onClick={() => {
                handleMenuClick();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl text-white hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300 text-left border border-transparent hover:border-blue-300 hover:border-opacity-50"
            >
              <span className="font-medium">เมนูอาหารแนะนำ</span>
            </button>
            
            <button
              onClick={() => {
                handleMealPlanClick();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl text-white hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300 text-left border border-transparent hover:border-blue-300 hover:border-opacity-50"
            >
              <span className="font-medium">แผนมื้ออาหาร</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
    </nav>
  );
};

export default NavBar;