import React, { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleIconClick = () => {
    navigate("/");
  };

  const handleMenuClick = () => {
    navigate("/menu");
  };

  const handleNutritionClick = () => {
    navigate("/nutrition");
  };

  const handleNutritionSuggestionClick = () => {
    navigate("/nutrition-suggestion");
  };

  const handleMealPlanClick = () => {
    navigate("/mealplanner");
  };

  return (
    //bg-[#2E77F8]
    <div className="bg-[#2E77F8] p-3">
      <div className="flex items-center justify-between">
        <div
          onClick={handleIconClick}
          className="text-white text-4xl font-bold pl-5 cursor-pointer md:pl-10"
        >
          NavBar
        </div>
        <div className="lg:hidden">
          <MenuOutlined
            className="!text-white text-2xl pr-5 cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
        <ul className="mt-3 text-xl hidden lg:flex mr-15 font-kanit md:space-x-8 md:text-lg lg:text-xl">
          <li>
            <a
              onClick={handleNutritionClick}
              className="text-white cursor-pointer"
            >
              โภชนาการที่เหมาะกับคุณ
            </a>
          </li>
          <li>
            <a
              onClick={handleNutritionSuggestionClick}
              className="text-white cursor-pointer"
            >
              ปริมาณที่ควรทาน
            </a>
          </li>
          <li>
            <a className="text-white cursor-pointer">ความรู้</a>
          </li>
          <li>
            <a onClick={handleMenuClick} className="text-white cursor-pointer">
              เมนูอาหารแนะนำ
            </a>
          </li>
          <li>
            <a
              onClick={handleMealPlanClick}
              className="text-white cursor-pointer"
            >
              แผนมื้ออาหาร
            </a>
          </li>
        </ul>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen ? (
        <ul className="lg:hidden space-x-15 md:ml-5 font-kanit pl-8">
          <li>
            <a
              onClick={handleNutritionClick}
              className="text-white cursor-pointer"
            >
              โภชนาการที่เหมาะกับคุณ
            </a>
          </li>
          <li>
            <a
              onClick={handleNutritionSuggestionClick}
              className="text-white cursor-pointer"
            >
              ปริมาณที่ควรทาน
            </a>
          </li>
          <li>
            <a href="#" className="text-white cursor-pointer">
              ความรู้
            </a>
          </li>
          <li>
            <a onClick={handleMenuClick} className="text-white cursor-pointer">
              เมนูอาหารแนะนำ
            </a>
          </li>
          <li>
            <a
              onClick={handleMealPlanClick}
              className="text-white cursor-pointer"
            >
              แผนมื้ออาหาร
            </a>
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default NavBar;
