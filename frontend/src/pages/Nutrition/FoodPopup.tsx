import React from "react";
import type { FoodItem } from "../../interfaces/FoodItem";

type FoodPopupProps = {
  item: FoodItem | null;
  onClose: () => void;
};

const FoodPopup: React.FC<FoodPopupProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto 
                    animate-in fade-in zoom-in duration-300">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-gray-100 hover:bg-gray-200 
                     rounded-full flex items-center justify-center text-gray-600 
                     hover:text-gray-800 transition-all duration-300 hover:scale-110"
          >
            ✕
          </button>

          <img
            src={item.Image}
            alt={item.Name}
            className="w-full h-40 object-cover rounded-t-2xl"
          />

          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 text-center">
              {item.Name}
            </h2>

            <div className="flex gap-2 justify-center mb-4">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs 
                           hover:bg-blue-200 transition-all duration-200 hover:scale-105">
                {item.FoodFlag.FoodGroup.Name}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs transition-all duration-200 hover:scale-105 ${
                item.FoodFlag?.Flag === "ควรหลีกเลี่ยง"
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : item.FoodFlag?.Flag === "ควรรับประทาน"
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
                {item.FoodFlag?.Flag || "ไม่ระบุ"}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-gray-700 text-sm">
                {item.Description || "ไม่มีรายละเอียด"}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <a
                href={item.Credit}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs underline 
                         transition-colors duration-200"
              >
                เครดิตรูปภาพ
              </a>
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 
                         px-4 py-2 rounded-lg text-sm transition-all duration-200
                         hover:scale-105 hover:shadow-md"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPopup;