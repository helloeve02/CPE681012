import React from "react";

interface MeasurementItem {
  food: string;
  portion: string;
  image: string;
  group: string;
}

interface MeasurementExamplePopupProps {
  item: MeasurementItem | null;
  onClose: () => void;
}

const MeasurementExamplePopup: React.FC<MeasurementExamplePopupProps> = ({ item, onClose }) => {
  if (!item) return null;

  const getCategoryStyle = (category: string) => {
    const styles = {
      ข้าวแป้ง: {
        gradient: "from-orange-500 to-amber-500",
        bgGradient: "from-orange-50 to-amber-50",
        border: "border-orange-200",
        text: "text-orange-700",
      },
      ผลไม้: {
        gradient: "from-pink-500 to-rose-500",
        bgGradient: "from-pink-50 to-rose-50",
        border: "border-pink-200",
        text: "text-pink-700",
      },
      ผัก: {
        gradient: "from-green-500 to-emerald-500",
        bgGradient: "from-green-50 to-emerald-50",
        border: "border-green-200",
        text: "text-green-700",
      },
    };
    return styles[category as keyof typeof styles] || styles["ผัก"];
  };

  const style = getCategoryStyle(item.group);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[85vh] transform animate-in slide-in-from-bottom-4 zoom-in duration-500 ease-out overflow-hidden">
        
        {/* Header with close button INSIDE */}
        <div className="relative">
          <div className={`bg-gradient-to-r ${style.gradient} px-4 py-4 text-white`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold">วิธีการวัดปริมาณ<br />{item.food}</h2>
            </div>
          </div>
          
          {/* Close button positioned correctly */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content with proper overflow handling */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-4rem)]">
          {/* Square image */}
          <div className="aspect-square rounded-xl overflow-hidden mb-5 max-h-80 mx-auto">
            <img
              src={item.image}
              alt={`วิธีการวัด ${item.food}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGM0Y0RjYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjQwIiBmaWxsPSIjRDVEN0RBIi8+PC9zdmc+";
              }}
            />
          </div>

          {/* Food name */}
          <div className="text-center mb-3">
            <h3 className="text-xl font-bold text-gray-900">{item.food} {item.portion}</h3>
          </div>

          {/* Close button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-slate-100 to-gray-100 hover:from-slate-200 hover:to-gray-200 
                       text-slate-700 hover:text-slate-800 px-6 py-2.5 rounded-xl text-sm font-medium 
                       transition-all duration-300 hover:shadow-md border border-slate-200 hover:border-slate-300 mb-5"
            >
              ปิด
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MeasurementExamplePopup;