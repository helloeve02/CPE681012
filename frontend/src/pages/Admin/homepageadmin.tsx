// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Newspaper, Utensils, ClipboardList } from "lucide-react"; // ไอคอนสวยๆ

export default function AdminDashboard() {
 

  const menuItems = [
    {
      title: "จัดการข่าวสารและการใช้ความรู้",
      link: "/admin/educational",
      icon: <Newspaper className="w-8 h-8 text-blue-600" />,
      bg: "from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
    },
    {
      title: "จัดการเมนูอาหารแนะนำ",
      link: "/admin/menu",
      icon: <Utensils className="w-8 h-8 text-green-600" />,
      bg: "from-green-50 to-green-100 hover:from-green-100 hover:to-green-200",
    },
    {
      title: "จัดการรายการอาหารและวัตถุดิบ",
      link: "/admin/fooditem",
      icon: <ClipboardList className="w-8 h-8 text-orange-600" />,
      bg: "from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex flex-col font-kanit">
      {/* Navbar */}
      

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          แผงควบคุมผู้ดูแลระบบ
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`rounded-3xl shadow-lg bg-gradient-to-br ${item.bg} p-6 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-all duration-300`}
            >
              <div className="bg-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-md mb-4">
                {item.icon}
              </div>
              <h2 className="text-gray-800 font-semibold text-lg">
                {item.title}
              </h2>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
