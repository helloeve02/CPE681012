import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Newspaper, Utensils, ClipboardList } from "lucide-react"; // ไอคอนสวยๆ

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLogin"); // ลบสถานะ login
    navigate("/admin"); // กลับไปหน้า login
  };

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
      <nav className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-gray-600 text-sm">ยินดีต้อนรับ</span>
          <div className="flex items-center space-x-4">
            <span className="text-gray-800 font-medium text-lg">Admin</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

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
