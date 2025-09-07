import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetMenuById } from "../../services/https/index";
import { ChevronLeft, Camera, Info, Scale, Clock, Users, Sparkles, AlertTriangle, Heart } from 'lucide-react';
import type { MenuInterface } from "../../interfaces/Menu";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState<MenuInterface | null>(null);
  const [loading, setLoading] = useState(true);

  const extractIngredients = (description: string) => {
    const part = description.split("วิธีทำ")[0];
    const lines = part.split("\n").filter(line => line.trim().startsWith("-"));

    const ingredients = lines.map(line => {
      const cleaned = line.replace(/^[-\t\s]+/, "");
      const [nameWithAmount, weightMatch] = cleaned.split(/\(([^)]+)\)/);
      const [name, quantity] = nameWithAmount.split(":").map(s => s.trim());

      return {
        name,
        quantity,
        weight: weightMatch ? weightMatch.trim() : "-"
      };
    });

    return ingredients;
  };

  useEffect(() => {
    const fetchMenu = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await GetMenuById(id);
        const data = res.data;
        const dataArray = Array.isArray(data) ? data : [data];
        setMenu(dataArray[0].menu);
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl font-kanit text-gray-600">ไม่พบ ID</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden font-kanit">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-cyan-300/30 to-teal-300/30 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl px-12 py-8 border border-white/50">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xl font-semibold text-gray-800">
                กำลังโหลดข้อมูล...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-kanit text-gray-600">ไม่พบข้อมูลเมนู</p>
        </div>
      </div>
    );
  }

  const description = menu.Description ?? "";
  const ingredients = extractIngredients(description);
  const isHighSodium = menu.Sodium ;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative px-6 py-8">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-sky-200/30 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-blue-300/20 to-sky-300/20 rounded-full blur-3xl"></div>
        </div>

        {/* Navigation Header */}
        <div className="relative flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 bg-white/80 hover:bg-white/95 
                      backdrop-blur-lg border border-blue-200/50 shadow-lg
                      px-6 py-3 rounded-2xl transition-all duration-300
                      hover:scale-105 active:scale-95 hover:shadow-xl"
          >
            <ChevronLeft 
              size={20} 
              className="text-blue-600 group-hover:text-blue-700 transition-colors" 
            />
            <span className="font-kanit text-blue-600 font-medium">กลับ</span>
          </button>
          
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-lg 
                          border border-blue-200/50 px-6 py-3 rounded-2xl shadow-lg">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
            <span className="font-kanit text-lg text-blue-700 font-medium">รายละเอียดเมนู</span>
          </div>
        </div>

        {/* Menu Details Card */}
        <div className="relative bg-white/90 backdrop-blur-xl border border-blue-200/50 
                        rounded-3xl p-8 shadow-2xl mx-auto max-w-4xl
                        hover:shadow-3xl transition-all duration-500">
          
          {/* Menu Title */}
          <div className="text-center mb-8">
            <h1 className="font-bold text-4xl md:text-5xl font-kanit mb-4
                          bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 
                          bg-clip-text text-transparent drop-shadow-sm">
              {menu.Title}
            </h1>
            
            {/* Decorative line */}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 
                            rounded-full mx-auto opacity-80"></div>
          </div>

          {/* Menu Image */}
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video w-full relative group">
              <img
                src={menu.Image}
                alt={menu.Title}
                className="w-full h-full object-cover transition-transform duration-700 
                         group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Image Credit */}
              {menu.Credit && (
                <div className="absolute bottom-4 right-4">
                  <a
                    href={menu.Credit}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-black/60 backdrop-blur-sm 
                             text-white px-3 py-2 rounded-lg text-sm font-kanit
                             hover:bg-black/80 transition-all duration-300"
                  >
                    <Camera size={16} />
                    ขอบคุณภาพ
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Nutrition Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Sodium Information */}
            <div className={`bg-gradient-to-r ${isHighSodium ? 'from-red-100 to-orange-100 border-red-300' : 'from-green-100 to-emerald-100 border-green-300'} 
                            border-2 rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 ${isHighSodium ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-pulse`}></div>
                <span className="font-kanit text-gray-700 font-medium">โซเดียม</span>
                {isHighSodium && <AlertTriangle size={16} className="text-red-500" />}
              </div>
              
              <div className="text-center">
                <span className={`font-kanit text-2xl md:text-3xl font-bold
                                ${isHighSodium ? 'text-red-600' : 'text-green-600'}`}>
                  {menu.Sodium} มก.
                </span>
                <p className="font-kanit text-gray-600 text-sm mt-2">
                  ต่อหนึ่งหน่วยบริโภค
                </p>
              </div>
            </div>

            {/* Health Status */}
            <div className="bg-gradient-to-r from-sky-100 to-blue-100 
                            border-2 border-sky-300 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="font-kanit text-gray-700 font-medium">โพแทสเซียม</span>
              </div>
              
              <div className="text-center">
                <span className={`font-kanit text-2xl md:text-3xl font-bold
                                ${isHighSodium ? 'text-red-600' : 'text-green-600'}`}>
                  {menu.Potassium} มก.
                </span>
                <p className="font-kanit text-gray-600 text-sm mt-2">
                  ต่อหนึ่งหน่วยบริโภค
                </p>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          {menu.Tags && menu.Tags.length > 0 && (
            <div className="mb-8">
              <h3 className="font-kanit font-bold text-xl text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏷️</span>
                หมวดหมู่อาหาร
              </h3>
              <div className="flex flex-wrap gap-3">
                {menu.Tags
                  .filter((tag): tag is { ID: number; Name: string } => tag.ID !== undefined)
                  .map(tag => (
                    <span
                      key={tag.ID}
                      className="bg-gradient-to-r from-blue-100 to-sky-100 
                               border-2 border-blue-300 text-blue-700 px-4 py-2 
                               rounded-full font-kanit font-medium shadow-sm 
                               hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                      {tag.Name}
                    </span>
                  ))}
              </div>
            </div>
          )}

          
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-blue-200/50 
                          rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Section Header */}
            <div className="bg-gradient-to-r from-blue-500 to-sky-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Scale size={28} />
                <h2 className="font-kanit font-bold text-2xl">ส่วนประกอบ</h2>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <Info size={18} />
                <p className="font-kanit text-sm">
                  **ปริมาณสารอาหารอาจแตกต่างกันไปตามแต่ละบุคคล**
                </p>
              </div>
            </div>

            {/* Ingredients Content */}
            <div className="p-6">
              {ingredients.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-lg text-gray-600 font-kanit">ไม่พบข้อมูลส่วนประกอบ</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Ingredients Grid Header */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 font-kanit font-semibold text-blue-700">
                      <span className="text-lg">🥘</span>
                      ส่วนประกอบ
                    </div>
                    <div className="text-center font-kanit font-semibold text-blue-700">
                      <span className="text-lg">📏</span> ปริมาณ
                    </div>
                    <div className="text-center font-kanit font-semibold text-blue-700">
                      <span className="text-lg">⚖️</span> น้ำหนัก
                    </div>
                  </div>

                  {/* Ingredients List */}
                  <div className="space-y-2">
                    {ingredients.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 p-4 bg-white hover:bg-blue-50 
                                 rounded-xl transition-all duration-200 font-kanit
                                 border-2 border-blue-100 hover:border-blue-200 shadow-sm"
                      >
                        <div className="text-gray-700 font-medium flex items-center gap-3">
                          <span className="bg-blue-500 text-white px-2 py-1 
                                         rounded-full text-xs font-bold min-w-[24px] text-center">
                            {index + 1}
                          </span>
                          {item.name}
                        </div>
                        <div className="text-center">
                          <span className="bg-green-100 text-green-700 px-3 py-1 
                                         rounded-full text-sm font-medium border-2 border-green-300">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="bg-orange-100 text-orange-700 px-3 py-1 
                                         rounded-full text-sm font-medium border-2 border-orange-300">
                            {item.weight}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary Card */}
            {ingredients.length > 0 && (
              <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-6 m-6 
                              rounded-2xl border-2 border-blue-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-kanit">
                      <p className="text-gray-600 text-sm">จำนวนส่วนประกอบ</p>
                      <p className="text-xl font-bold text-blue-600">{ingredients.length} รายการ</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-kanit">
                      <p className="text-gray-600 text-sm">เวลาเตรียม</p>
                      <p className="text-xl font-bold text-green-600">~30 นาที</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <Scale className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-kanit">
                      <p className="text-gray-600 text-sm">ระดับความยาก</p>
                      <p className="text-xl font-bold text-orange-600">ปานกลาง</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-sky-600 
                       hover:from-blue-600 hover:to-sky-700 text-white px-8 py-4 
                       rounded-2xl font-kanit text-lg font-medium shadow-lg 
                       hover:shadow-xl transform hover:scale-105 transition-all duration-300
                       border-2 border-blue-300 hover:border-blue-400"
            >
              <ChevronLeft size={22} />
              กลับไปหน้าเมนู
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;