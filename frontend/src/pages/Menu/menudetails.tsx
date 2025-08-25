import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetMenuById } from "../../services/https/index";
import { ChevronLeft, Camera, Info, Scale, Clock, Users, Sparkles } from 'lucide-react';
import type { MenuInterface } from "../../interfaces/Menu";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState<MenuInterface | null>(null);
  const [loading, setLoading] = useState(true);

  const extractIngredients = (description: string) => {
    const part = description.split("วิธีทำ")[0]; // เอาเฉพาะก่อน "วิธีทำ"
    const lines = part.split("\n").filter(line => line.trim().startsWith("-"));

    const ingredients = lines.map(line => {
      const cleaned = line.replace(/^[-\t\s]+/, ""); // ลบ -, tab, ช่องว่างต้นบรรทัด
      const [nameWithAmount, weightMatch] = cleaned.split(/\(([^)]+)\)/); // แยกชื่อ+ปริมาณ กับน้ำหนัก
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
        console.log(dataArray[0].menu);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-kanit text-gray-600">กำลังโหลด...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Header with Back Button */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-300"></div>
        </div>
        
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 
                       px-4 py-2 rounded-2xl transition-all duration-300 
                       hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={20} />
              <span className="font-kanit">กลับ</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <span className="font-kanit text-lg">รายละเอียดเมนู</span>
            </div>
          </div>
          
          <h1 className="font-bold text-3xl md:text-4xl font-kanit text-center 
                       bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            {menu.Title}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Food Image Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 relative group">
            <img
              src={menu.Image}
              alt={menu.Title}
              className="w-full h-full object-cover transition-transform duration-700 
                       group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <Camera size={20} />
                <span className="font-kanit">แหล่งที่มาของภาพ</span>
              </div>
              <a
                href={menu.Credit}
                target="_blank"
                rel="noopener noreferrer"
                className="font-kanit text-blue-600 hover:text-blue-700 underline 
                         decoration-2 underline-offset-4 hover:decoration-blue-400 
                         transition-colors duration-300"
              >
                ขอบคุณภาพจาก 🔗
              </a>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        {menu.Tags && menu.Tags.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-kanit font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏷️</span>
                หมวดหมู่อาหาร
              </h3>
              <div className="flex flex-wrap gap-3">
                {menu.Tags
                  .filter((tag): tag is { ID: number; Name: string } => tag.ID !== undefined)
                  .map(tag => (
                    <span
                      key={tag.ID}
                      className="bg-gradient-to-r from-yellow-100 to-orange-100 
                               text-orange-700 px-4 py-2 rounded-full font-kanit 
                               font-medium shadow-sm hover:shadow-md transition-shadow"
                    >
                      {tag.Name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Ingredients Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Scale size={28} />
              <h2 className="font-kanit font-bold text-2xl">ส่วนประกอบ</h2>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <Info size={18} />
              <p className="font-kanit text-sm">
                **ปริมาณสารอาหารอาจแตกต่างกันไปตามแต่ละบุคคล**
              </p>
            </div>
          </div>

          {/* Ingredients Table */}
          <div className="p-6">
            {ingredients.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-lg text-gray-500 font-kanit">ไม่พบข้อมูลส่วนประกอบ</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                  <div className="grid grid-cols-3 gap-4 font-kanit font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🥘</span>
                      ส่วนประกอบ
                    </div>
                    <div className="text-center flex items-center justify-center gap-2">
                      <span className="text-lg">📏</span>
                      ปริมาณ
                    </div>
                    <div className="text-center flex items-center justify-center gap-2">
                      <span className="text-lg">⚖️</span>
                      น้ำหนัก
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {ingredients.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 p-4 hover:bg-blue-50 
                               transition-colors duration-200 font-kanit"
                    >
                      <div className="text-gray-800 font-medium">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 
                                       rounded-full text-xs mr-2 font-bold">
                          {index + 1}
                        </span>
                        {item.name}
                      </div>
                      <div className="text-center">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 
                                       rounded-full text-sm font-medium">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 
                                       rounded-full text-sm font-medium">
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 m-6 rounded-2xl border border-blue-100">
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
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="font-kanit">
                  <p className="text-gray-600 text-sm">เวลาเตรียม</p>
                  <p className="text-xl font-bold text-emerald-600">~30 นาที</p>
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
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 
                     hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 
                     rounded-2xl font-kanit text-lg font-medium shadow-lg 
                     hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <ChevronLeft size={22} />
            กลับไปหน้าเมนู
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;