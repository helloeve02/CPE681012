import type { MenuInterface } from "../../interfaces/Menu";
import { GetAllMenu, GetFoodItemsByFlags, GetAllTag } from "../../services/https";
import React, { useEffect, useState } from "react";
import { ChevronRight, Search, Eye, Filter, Calculator, Sparkles, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IngredientsInterface } from "../../interfaces/Ingredients"
import type { TagInterface } from "../../interfaces/Tag"
import { useNavigate } from "react-router-dom";

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"food" | "ingredient">("food");
  const [ingredients, setIngredients] = useState<IngredientsInterface[]>([]);
  const [tags, setTags] = useState<TagInterface[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<IngredientsInterface | null>(null);

  const navigate = useNavigate();

  // Filter เมนูตาม search + selectedTags
  const filteredItems = menu.filter(menuItem => {
    const matchQuery = (menuItem.Title?.toLowerCase() ?? '').includes(query.toLowerCase());

    if (selectedTags.length === 0) return matchQuery;

    const hasSelectedTag = menuItem.Tags
      ?.filter((tag): tag is { ID: number } => tag.ID !== undefined)
      .some(tag => selectedTags.includes(tag.ID));

    return matchQuery && Boolean(hasSelectedTag);
  });

  // Filter วัตถุดิบตาม search
  const filteredIngre = ingredients.filter(ingredients =>
    (ingredients.Name?.toLowerCase() ?? '').includes(query.toLowerCase())
  );

  // Toggle checkbox tag
  const toggleTag = (tagID: number) => {
    if (selectedTags.includes(tagID)) {
      setSelectedTags(selectedTags.filter(id => id !== tagID));
    } else {
      setSelectedTags([...selectedTags, tagID]);
    }
  };

  // API Call
  const getAllMenu = async () => {
    try {
      const res = await GetAllMenu();
      if (Array.isArray(res?.data?.menu)) {
        setMenu(res.data.menu);
      } else {
        setError("Failed to load menu items");
      }
    } catch {
      setError("Error fetching menu items. Please try again later.");
    }
  };

  const getFoodItemsByFlags = async () => {
    try {
      const res = await GetFoodItemsByFlags();
      if (Array.isArray(res?.data?.fooditems)) {
        setIngredients(res.data.fooditems);
      } else {
        setError("Failed to load ingredients items");
      }
    } catch {
      setError("Error fetching ingredients items. Please try again later.");
    }
  };

  const getAllTags = async () => {
    try {
      const res = await GetAllTag();
      if (Array.isArray(res?.data?.tag)) {
        setTags(res.data.tag);
      } else {
        setError("Failed to load tags");
      }
    } catch {
      setError("Error fetching tags. Please try again later.");
    }
  };

  useEffect(() => {
    getAllMenu();
    getFoodItemsByFlags();
    getAllTags();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-700"></div>
        </div>
        <div className="relative px-6 py-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 mr-3 text-yellow-300" />
            <h1 className="font-bold text-4xl md:text-5xl font-kanit bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              เมนูอาหารแนะนำ
            </h1>
            <Sparkles className="w-8 h-8 ml-3 text-yellow-300" />
          </div>
          <p className="text-blue-100 font-kanit text-lg max-w-2xl mx-auto">
            ค้นพบเมนูอาหารและวัตถุดิบคุณภาพสูงสำหรับการดูแลสุขภาพ
          </p>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 p-1 rounded-xl mt-6 mb-4">
              <button
                onClick={() => setActiveTab("food")}
                className={`px-8 py-3 rounded-lg font-kanit text-lg font-medium transition-all duration-300 ${activeTab === "food"
                    ? "bg-white text-blue-600 shadow-md transform scale-105"
                    : "text-gray-600 hover:text-blue-500 hover:bg-white/50"
                  }`}
              >
                🍽️ อาหาร
              </button>
              <button
                onClick={() => setActiveTab("ingredient")}
                className={`px-8 py-3 rounded-lg font-kanit text-lg font-medium transition-all duration-300 ${activeTab === "ingredient"
                    ? "bg-white text-blue-600 shadow-md transform scale-105"
                    : "text-gray-600 hover:text-blue-500 hover:bg-white/50"
                  }`}
              >
                🥬 วัตถุดิบ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-grow max-w-2xl">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
              <Search size={22} />
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`🔍 ค้นหา${activeTab === "food" ? "เมนูอาหาร" : "วัตถุดิบ"}ที่คุณต้องการ...`}
              className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-200 rounded-2xl 
                       focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                       font-kanit text-lg shadow-lg transition-all duration-300
                       hover:shadow-xl hover:border-blue-300"
            />
          </div>

          {/* Filter Dropdown */}
          {activeTab === "food" && (
            <div className="relative">
              <button
                onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                className="flex items-center gap-3 bg-white border-2 border-gray-200 
                         hover:border-blue-300 hover:shadow-lg rounded-2xl px-6 py-4 
                         font-kanit text-lg transition-all duration-300 min-w-[200px]"
              >
                <Filter size={20} className="text-blue-500" />
                <span>กรองตามแท็ก</span>
                <span className="text-blue-500 ml-auto">
                  {isTagDropdownOpen ? "▲" : "▼"}
                </span>
              </button>

              {isTagDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl 
                              border border-gray-100 min-w-[280px] max-h-80 overflow-y-auto z-50">
                  <div className="p-6 space-y-3">
                    <div className="text-gray-800 font-kanit font-medium mb-4 text-lg">
                      เลือกหมวดหมู่อาหาร
                    </div>
                    {tags
                      .filter((tag): tag is TagInterface & { ID: number } => tag.ID !== undefined)
                      .map(tag => (
                        <label key={tag.ID} className="flex items-center space-x-3 cursor-pointer 
                                                     p-3 rounded-xl hover:bg-blue-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag.ID)}
                            onChange={() => toggleTag(tag.ID)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="font-kanit text-gray-700">{tag.Name}</span>
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Calculator Button */}
          <button
            onClick={() => navigate("/menucal")}
            className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 
                     hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 
                     rounded-2xl font-kanit text-lg font-medium shadow-lg 
                     hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Calculator size={22} />
            คำนวณปริมาณโซเดียม
          </button>

          <button
            onClick={() => navigate("/cleaningre")}
            className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 
                     hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 
                     rounded-2xl font-kanit text-lg font-medium shadow-lg 
                     hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Leaf size={22} />
            วิธีการล้างผัก
          </button>
        </div>

        {/* Selected Tags Display */}
        {selectedTags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="font-kanit text-gray-600 mr-2">แท็กที่เลือก:</span>
            {selectedTags.map(tagId => {
              const tag = tags.find(t => t.ID === tagId);
              return tag ? (
                <span key={tagId} className="inline-flex items-center gap-2 bg-blue-100 
                                           text-blue-800 px-4 py-2 rounded-full font-kanit text-sm">
                  {tag.Name}
                  <button
                    onClick={() => toggleTag(tagId)}
                    className="hover:text-blue-600"
                  >
                    ✕
                  </button>
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {activeTab === "food" && (
          <div className="space-y-6">
            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-gray-500 font-kanit">ไม่พบเมนูที่คุณค้นหา</p>
                <p className="text-gray-400 font-kanit mt-2">ลองเปลี่ยนคำค้นหาหรือแท็กดูนะครับ</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div key={item.ID} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                                            transition-all duration-500 overflow-hidden border border-gray-100
                                            hover:transform hover:scale-[1.02]">
                  <div className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 
                                    shadow-inner group-hover:shadow-lg transition-shadow">
                        <img src={item.Image} className="w-full h-full object-cover 
                                                       group-hover:scale-110 transition-transform duration-500" />
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="text-2xl">⭐</div>
                          <div className="flex flex-wrap gap-2">
                            {item.Tags
                              ?.filter((tag): tag is { ID: number; Name: string } => tag.ID !== undefined)
                              .map(tag => (
                                <span
                                  key={tag.ID}
                                  className="bg-gradient-to-r from-yellow-100 to-orange-100 
                                           text-orange-700 px-3 py-1 rounded-full text-sm 
                                           font-medium font-kanit shadow-sm"
                                >
                                  {tag.Name}
                                </span>
                              ))}
                          </div>
                        </div>

                        <h3 className="text-xl font-kanit font-bold text-gray-800 mb-4 
                                     group-hover:text-blue-600 transition-colors">
                          {item.Title}
                        </h3>

                        <Link to={`/menu/${item.ID}`}>
                          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                                           hover:from-blue-600 hover:to-blue-700 text-white 
                                           px-6 py-3 rounded-2xl flex items-center justify-center 
                                           gap-2 font-kanit font-medium shadow-md hover:shadow-lg 
                                           transition-all duration-300 group-hover:transform 
                                           group-hover:scale-105">
                            <span>ดูข้อมูลเพิ่มเติม</span>
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "ingredient" && (
          <div className="space-y-6">
            {filteredIngre.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🥬</div>
                <p className="text-xl text-gray-500 font-kanit">ไม่พบผลไม้และวัตถุดิบที่คุณค้นหา</p>
                <p className="text-gray-400 font-kanit mt-2">ลองเปลี่ยนคำค้นหาดูนะครับ</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredIngre.map((item) => (
                <div key={item.ID} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                                            transition-all duration-500 overflow-hidden border border-gray-100
                                            hover:transform hover:scale-[1.02]">
                  <div className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 
                                    shadow-inner group-hover:shadow-lg transition-shadow">
                        <img src={item.Image} className="w-full h-full object-cover 
                                                       group-hover:scale-110 transition-transform duration-500" />
                      </div>

                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-kanit font-bold text-gray-800 mb-3 
                                       group-hover:text-blue-600 transition-colors">
                            {item.Name}
                          </h3>

                          <div className="mb-4">
                            <a href={item.Credit} target="_blank" rel="noopener noreferrer"
                              className="text-sm font-kanit text-blue-500 hover:text-blue-600 
                                        underline decoration-dotted">
                              📷 ขอบคุณภาพจาก
                            </a>
                          </div>
                        </div>

                        <button
                          onClick={() => setViewingItem(item)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 
                                   hover:from-emerald-600 hover:to-teal-700 text-white 
                                   px-6 py-3 rounded-2xl flex items-center justify-center 
                                   gap-2 font-kanit font-medium shadow-md hover:shadow-lg 
                                   transition-all duration-300 group-hover:transform 
                                   group-hover:scale-105"
                        >
                          <Eye size={18} />
                          <span>ดูรายละเอียด</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto 
                        animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <button
                onClick={() => setViewingItem(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white 
                         rounded-full flex items-center justify-center text-gray-500 
                         hover:text-gray-700 shadow-lg z-10 transition-all"
              >
                ✕
              </button>

              <div className="aspect-video w-full bg-gray-100 rounded-t-3xl overflow-hidden">
                <img
                  src={viewingItem.Image}
                  alt={viewingItem.Name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-kanit font-bold text-gray-900 mb-4">
                  {viewingItem.Name}
                </h2>

                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                  <p className="text-gray-700 font-kanit text-lg leading-relaxed">
                    {viewingItem.Description || "ยังไม่มีรายละเอียดเพิ่มเติมในขณะนี้"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href={viewingItem.Credit}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 
                             font-kanit font-medium underline decoration-2 underline-offset-4"
                  >
                    📷 ขอบคุณภาพจาก
                  </a>

                  <button
                    onClick={() => setViewingItem(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 
                             rounded-2xl font-kanit font-medium transition-colors"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;