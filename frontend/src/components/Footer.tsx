import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  
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

  const handleKnowledgeClick = () => {
    navigate("/selectnewscategorypage");
  };

  return (
    <footer className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 font-kanit mt-auto">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div
              onClick={handleIconClick}
              className="flex items-center space-x-3 cursor-pointer group mb-4"
            >
              <div className="bg-blue-500 p-2 rounded-xl transition-all duration-300">
                <div className="w-8 h-8 text-white flex items-center justify-center font-bold text-lg">
                  N
                </div>
              </div>
              <div className="text-white">
                <div className="text-xl font-bold group-hover:text-blue-100 transition-colors duration-300">
                  NutriApp
                </div>
                <div className="text-xs text-blue-100 -mt-1">Health Dashboard</div>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              แอปพลิเคชันที่ช่วยดูแลสุขภาพและโภชนาการของคุณอย่างครบครัน
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">เมนูหลัก</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={handleNutritionClick}
                  className="text-blue-100 hover:text-white transition-colors duration-300 text-sm block hover:translate-x-1 transform transition-transform"
                >
                  โภชนาการที่เหมาะกับคุณ
                </button>
              </li>
              <li>
                <button
                  onClick={handleNutritionSuggestionClick}
                  className="text-blue-100 hover:text-white transition-colors duration-300 text-sm block hover:translate-x-1 transform transition-transform"
                >
                  ปริมาณที่ควรทาน
                </button>
              </li>
              <li>
                <button
                  onClick={handleMenuClick}
                  className="text-blue-100 hover:text-white transition-colors duration-300 text-sm block hover:translate-x-1 transform transition-transform"
                >
                  เมนูอาหารแนะนำ
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">บริการ</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={handleMealPlanClick}
                  className="text-blue-100 hover:text-white transition-colors duration-300 text-sm block hover:translate-x-1 transform transition-transform"
                >
                  แผนมื้ออาหาร
                </button>
              </li>
              <li>
                <button
                  onClick={handleKnowledgeClick}
                  className="text-blue-100 hover:text-white transition-colors duration-300 text-sm block hover:translate-x-1 transform transition-transform"
                >
                  ความรู้
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">ติดต่อเรา</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <div className="w-4 h-4 text-white flex items-center justify-center text-xs">
                    📧
                  </div>
                </div>
                <span className="text-blue-100 text-sm">info@nutriapp.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <div className="w-4 h-4 text-white flex items-center justify-center text-xs">
                    📱
                  </div>
                </div>
                <span className="text-blue-100 text-sm">02-xxx-xxxx</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <div className="w-4 h-4 text-white flex items-center justify-center text-xs">
                    🕒
                  </div>
                </div>
                <span className="text-blue-100 text-sm">24/7 บริการ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-blue-500 border-opacity-30 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-4">
              <div className="bg-blue-500 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105">
                <div className="w-5 h-5 text-white flex items-center justify-center font-bold">
                  f
                </div>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105">
                <div className="w-5 h-5 text-white flex items-center justify-center font-bold">
                  ig
                </div>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105">
                <div className="w-5 h-5 text-white flex items-center justify-center font-bold">
                  tw
                </div>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105">
                <div className="w-5 h-5 text-white flex items-center justify-center font-bold">
                  yt
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex space-x-6 text-blue-100 text-sm">
                <button className="hover:text-white transition-colors duration-300">
                  นโยบายความเป็นส่วนตัว
                </button>
                <button className="hover:text-white transition-colors duration-300">
                  เงื่อนไขการใช้งาน
                </button>
              </div>
              <div className="text-center md:text-right max-w-lg">
                <p className="text-blue-100 text-sm leading-relaxed">
                  NutriApp เป็นส่วนหนึ่งของโปรเจ็ค "เว็บแอปพลิเคชันเพื่อการวิเคราะห์และให้คำแนะนำทางโภชนาการส่วนบุคคลสําหรับผู้ป่วยโรคไตและโรคเบาหวาน" ซึ่งเป็นส่วนหนึ่งของรายวิชา<br />ENG23 4080 Computer Engineering Capstone Project
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-400"></div>
    </footer>
  );
};

export default Footer;