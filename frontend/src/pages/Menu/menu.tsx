import type { MenuInterface } from "../../interfaces/Menu";
import { GetAllMenu, GetFoodItemsByFlags, GetAllTag } from "../../services/https";
import React, { useEffect, useState } from "react";
import { ChevronRight, Search, Eye } from 'lucide-react';
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
  const [viewingItem, setViewingItem] = useState<IngredientsInterface | null>(null); // ✅ สำหรับ popup

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
    <div className="max-w mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#2E77F8] text-white px-4 py-6">
        <h2 className="font-semibold text-4xl text-center font-kanit">เมนูอาหารแนะนำ</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-300 mt-4">
        <ul className="flex justify-around font-kanit text-lg">
          <li
            onClick={() => setActiveTab("food")}
            className={`flex-1 text-center cursor-pointer pb-2 ${activeTab === "food"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
              }`}
          >
            อาหาร
          </li>
          <li
            onClick={() => setActiveTab("ingredient")}
            className={`flex-1 text-center cursor-pointer pb-2 ${activeTab === "ingredient"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
              }`}
          >
            วัตถุดิบ
          </li>
        </ul>
      </div>

      {/* Search + Tag Dropdown */}
      <div className="max-w-md mx-auto mt-5 flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2E77F8]" size={20} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`ค้นหา${activeTab === "food" ? "เมนูอาหาร" : "วัตถุดิบ"}...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-kanit"
          />
        </div>

        {activeTab === "food" && (
          <div className="border-gray-300 rounded-lg p-3 font-kanit relative max-w-xs min-w-[20px]">
            <p
              className="font-xl mb-2 cursor-pointer select-none"
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
            >
              กรองตามแท็กอาหาร <span>{isTagDropdownOpen ? "▲" : "▼"}</span>
            </p>

            {isTagDropdownOpen && (
              <div className="flex flex-col gap-3 max-h-40 overflow-y-auto border-t border-gray-200 pt-2">
                {tags
                  .filter((tag): tag is TagInterface & { ID: number } => tag.ID !== undefined)
                  .map(tag => (
                    <label key={tag.ID} className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.ID)}
                        onChange={() => toggleTag(tag.ID)}
                      />
                      <span>{tag.Name}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        )}

      </div>

      <div className="flex justify-end px-25 mb-3 font-kanit">
        <button
          type="button"
          onClick={() => navigate("/menucal")}
          className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5
                   bg-sky-600 text-white shadow-sm hover:bg-sky-500
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400
                   active:scale-[0.99] transition"
          aria-label="คำนวณปริมาณโซเดียม"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="currentColor" className="h-5 w-5">
            <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 
                   2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2 3v4h8V5H8zm0 
                   6v2h2v-2H8zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2zM8 
                   15v2h2v-2H8zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z"/>
          </svg>
          คำนวณปริมาณโซเดียม
        </button>
      </div>


      {/* Tab Content */}
      <div className="p-4 space-y-4 px-25">
        {activeTab === "food" && (
          <>
            {filteredItems.length === 0 && (
              <p className="text-center text-gray-500 font-kanit mt-4 ">ไม่พบเมนูที่คุณค้นหา</p>
            )}
            {filteredItems.map((item) => (
              <div key={item.ID} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between px-15">
                <div className="flex items-center space-x-4">
                  <div className="w-38 h-30 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.Image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-yellow-500 text-xl">⭐</span>
                      <div className="flex flex-wrap gap-2">
                        {item.Tags
                          ?.filter((tag): tag is { ID: number; Name: string } => tag.ID !== undefined)
                          .map(tag => (
                            <span
                              key={tag.ID}
                              className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium"
                            >
                              {tag.Name}
                            </span>
                          ))}
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-kanit text-gray-800 ml-3">
                      {item.Title}
                    </h3>
                  </div>
                </div>
                <Link to={`/menu/${item.ID}`}>
                  <button className="w-40 max-w-sm bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-full flex items-center justify-center space-x-1 text-sm sm:text-base font-kanit shadow">
                    <span>ดูข้อมูลเพิ่มเติม</span>
                    <ChevronRight size={19} />
                  </button>
                </Link>
              </div>
            ))}
          </>
        )}

        {activeTab === "ingredient" && (
          <>
            {filteredIngre.length === 0 && (
              <p className="text-center text-gray-500 font-kanit mt-4">ไม่พบผลไม้และวัตถุดิบที่คุณค้นหา</p>
            )}
            {filteredIngre.map((item) => (
              <div key={item.ID} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between px-17">
                <div className="flex items-center space-x-4">
                  <div className="w-38 h-30 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.Image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-kanit text-gray-800 ml-3 mb-3">
                      {item.Name}
                    </h3>
                    <h3 className="text-lg sm:text-x font-kanit text-blue-800 ml-3 text-center">
                      <a href={item.Credit} target="_blank" rel="noopener noreferrer">
                        ขอบคุณภาพจาก
                      </a>
                    </h3>
                  </div>
                </div>


                <button
                  onClick={() => setViewingItem(item)}
                  className="w-40 max-w-sm bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-full flex items-center justify-center space-x-1 text-sm sm:text-base font-kanit shadow"
                >
                  <Eye size={18} />
                  ดูรายละเอียด
                </button>

              </div>
            ))}
          </>
        )}
      </div>

      {/* Popup Modal สำหรับ ingredient */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setViewingItem(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <img
              src={viewingItem.Image}
              alt={viewingItem.Name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />

            <h2 className="text-2xl font-kanit font-bold text-gray-900 mb-2">
              {viewingItem.Name}
            </h2>
            <p className="text-gray-700 font-kanit mb-4">
              {viewingItem.Description || "ยังไม่มีรายละเอียดเพิ่มเติม"}
            </p>

            <a
              href={viewingItem.Credit}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              ขอบคุณภาพจาก
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
