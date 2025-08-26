import React from "react";
import type { FoodItem } from "../../interfaces/FoodItem";

type FoodPopupProps = {
  item: FoodItem | null;
  onClose: () => void;
};

const FoodPopup: React.FC<FoodPopupProps> = ({ item, onClose }) => {
  if (!item) return null; // don't render if no item

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/10 p-4">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full max-h-[90vh] overflow-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {/* Food Info */}
        <h2 className="text-xl font-semibold mb-2 text-center">{item.Name}</h2>
        <p className="text-sm text-gray-600 mb-2">
          กลุ่ม: {item.FoodFlag.FoodGroup.Name}
        </p>
        <p
          className={`text-sm mb-4 ${
            item.FoodFlag?.Flag === "ควรหลีกเลี่ยง"
              ? "text-red-500"
              : item.FoodFlag?.Flag === "ควรรับประทาน"
              ? "text-green-700"
              : "text-gray-500"
          }`}
        >
          หมวด: {item.FoodFlag?.Flag || "-"}
        </p>

        <img
          src={item.Image}
          alt={item.Name}
          className="w-full h-48 object-cover rounded mb-4"
        />

        <p className="text-gray-700">เหตผล: {item.Description}</p>

        <a
          href={item.Credit}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 text-sm mt-3 inline-block"
        >
          เครดิตรูปภาพ
        </a>
      </div>
    </div>
  );
};

export default FoodPopup;
