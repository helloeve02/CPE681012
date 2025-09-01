import React from "react";
import type { FoodItem } from "../../interfaces/FoodItem";
import type { FoodExchangeInterface } from "../../interfaces/FoodExchange";

interface NormalizedFood {
  Name?: string;
  Image?: string;
  Credit?: string;
  Description?: string;
  FoodFlag?: {
    Flag?: string;
    FoodGroup?: {
      Name?: string;
    };
  };
  Amount?: string;
  Unit?: string;
}

type FoodPopupProps = {
  item: FoodItem | FoodExchangeInterface | null;
  onClose: () => void;
};

const FoodPopup: React.FC<FoodPopupProps> = ({ item, onClose }) => {
  if (!item) return null;

  const normalized: NormalizedFood =
    "FoodItem" in item
      ? {
          Name: item.FoodItem?.Name,
          Image: item.FoodItem?.Image,
          Credit: item.FoodItem?.Credit,
          Amount: item.Amount,
          Unit: item.Unit,
        }
      : {
          Name: (item as FoodItem)?.Name,
          Image: (item as FoodItem)?.Image,
          Credit: (item as FoodItem)?.Credit,
          Description: (item as FoodItem)?.Description,
          FoodFlag: (item as FoodItem)?.FoodFlag,
        };

  const getFlagStyles = (flag: string) => {
    switch (flag) {
      case "ควรหลีกเลี่ยง":
        return "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200";
      case "ควรรับประทาน":
        return "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200";
      default:
        return "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden transform animate-in slide-in-from-bottom-4 zoom-in duration-500 ease-out">
        {/* Header with close button */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white 
                     rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 
                     transition-all duration-300 hover:scale-110 shadow-lg border border-gray-100 z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image section with gradient overlay */}
          {normalized.Image && (
            <div className="relative h-48 overflow-hidden rounded-t-3xl">
              <img
                src={normalized.Image}
                alt={normalized.Name || "food"}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-12rem)]">
          {/* Food name */}
          {normalized.Name && (
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center leading-tight">
              {normalized.Name}
            </h2>
          )}

          {/* Tags section */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {normalized.FoodFlag?.FoodGroup?.Name && (
              <span className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                {normalized.FoodFlag.FoodGroup.Name}
              </span>
            )}
            {normalized.FoodFlag?.Flag && (
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${getFlagStyles(normalized.FoodFlag.Flag)}`}>
                {normalized.FoodFlag.Flag}
              </span>
            )}
          </div>

          {/* Exchange amount section */}
          {normalized.Amount && normalized.Unit && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-amber-800 font-semibold">1 ส่วน เท่ากับ </span>
                <span className="text-amber-900 font-bold">{normalized.Amount} {normalized.Unit}</span>
              </div>
            </div>
          )}

          {/* Description section */}
          {normalized.Description && (
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-700 text-sm leading-relaxed">{normalized.Description}</p>
              </div>
            </div>
          )}

          {/* Footer section */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            {normalized.Credit ? (
              <a
                href={normalized.Credit}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs underline decoration-dotted underline-offset-2 transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                เครดิตรูปภาพ
              </a>
            ) : (
              <div />
            )}
            
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-slate-100 to-gray-100 hover:from-slate-200 hover:to-gray-200 
                       text-slate-700 hover:text-slate-800 px-6 py-2.5 rounded-xl text-sm font-medium 
                       transition-all duration-300 hover:shadow-md border border-slate-200 hover:border-slate-300"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPopup;