import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper,
  Utensils,
  ClipboardList,
  TrendingUp,
  Star,
  Activity,
  Zap,
  Heart,
  Globe,
} from "lucide-react";
import { TopBarAdmin } from "../../components/TopBarAdmin"

export default function AdminDashboard() {

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // read name from localStorage like the old behavior you wanted
  const firstname =
    (typeof window !== "undefined" && localStorage.getItem("firstname")) ||
    "Administrator";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);


  // MENU: preserve modern look but restore real navigation
  const menuItems: Array<{
    title: string;
    link: string;
    gradient: string;
    description: string;
    delay: string;
    stats: { total: number | string; recent: number | string };
    color: "blue" | "green" | "orange";
    iconBg: string;
    icon: React.ReactNode;
  }> = [
      {
        title: "จัดการข่าวสารและการใช้ความรู้",
        link: "/admin/educational",
        icon: <Newspaper className="w-10 h-10" />,
        gradient: "from-blue-500 via-blue-600 to-cyan-500",
        description: "จัดการเนื้อหาข่าวสารและบทความสุขภาพ",
        delay: "delay-100",
        stats: { total: 24, recent: 3 },
        color: "blue",
        iconBg: "from-blue-400 to-cyan-400",
      },
      {
        title: "จัดการเมนูอาหารแนะนำ",
        link: "/admin/menu",
        icon: <Utensils className="w-10 h-10" />,
        gradient: "from-green-500 via-emerald-500 to-teal-500",
        description: "จัดการเมนูอาหารและคำแนะนำโภชนาการ",
        delay: "delay-200",
        stats: { total: 156, recent: 12 },
        color: "green",
        iconBg: "from-green-400 to-emerald-400",
      },
      {
        title: "จัดการรายการอาหารและวัตถุดิบ",
        link: "/admin/fooditem",
        icon: <ClipboardList className="w-10 h-10" />,
        gradient: "from-orange-500 via-amber-500 to-yellow-500",
        description: "จัดการข้อมูลอาหารและส่วนผสม",
        delay: "delay-300",
        stats: { total: 89, recent: 7 },
        color: "orange",
        iconBg: "from-orange-400 to-amber-400",
      },
      {
        title: "จัดการแอดมิน",
        link: "/admin/adminmanage",
        icon: <ClipboardList className="w-10 h-10" />,
        gradient: "from-orange-500 via-amber-500 to-yellow-500",
        description: "จัดการข้อมูลอาหารและส่วนผสม",
        delay: "delay-300",
        stats: { total: 89, recent: 7 },
        color: "orange",
        iconBg: "from-orange-400 to-amber-400",
      },
    ];

  const notifications = [
    { id: 1, message: "มีข่าวสารใหม่ 3 รายการรอการอนุมัติ", time: "2 นาทีที่แล้ว", type: "info" },
    { id: 2, message: "เมนูอาหารยอดนิยมได้รับการอัพเดต", time: "15 นาทีที่แล้ว", type: "success" },
    { id: 3, message: "ระบบสำรองข้อมูลเสร็จสิ้น", time: "1 ชั่วโมงที่แล้ว", type: "success" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 font-sans relative overflow-hidden font-kanit">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-cyan-300/30 to-teal-300/30 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full filter blur-3xl animate-pulse delay-[2000ms]"></div>
      </div>

      {/* Floating Sparkles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 animate-ping"></div>
          </div>
        ))}
      </div>

      {/* Navbar */}
      <div>
        <TopBarAdmin />
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-8 py-12 font-kanit">
        {/* Hero Section */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <div className="relative">
            <h1 className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent mb-8 leading-tight drop-shadow-sm">
              แผงควบคุมผู้ดูแลระบบ
            </h1>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 rounded-full shadow-lg"></div>
          </div>
          <p className="text-gray-700 text-2xl max-w-4xl mx-auto leading-relaxed mt-12 font-medium">
            จัดการเนื้อหาและข้อมูลต่างๆ ของระบบแอปพลิเคชันสุขภาพ
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold">
              ด้วยเทคโนโลยีที่ทันสมัยและใช้งานง่าย
            </span>
          </p>
          <div className="flex justify-center mt-12 space-x-4">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce shadow-lg"></div>
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce delay-100 shadow-lg"></div>
            <div className="w-4 h-4 bg-indigo-400 rounded-full animate-bounce delay-200 shadow-lg"></div>
          </div>
        </div>

        {/* Super Stats Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          {[
            {
              label: "เนื้อหาทั้งหมด",
              value: "269",
              icon: <Activity className="w-7 h-7" />,
              color: "blue",
              change: "+12%",
              bg: "from-blue-500 to-cyan-500",
            },
            {
              label: "ผู้เข้าชมวันนี้",
              value: "1,247",
              icon: <TrendingUp className="w-7 h-7" />,
              color: "cyan",
              change: "+8%",
              bg: "from-cyan-500 to-teal-500",
            },
            {
              label: "อัพเดตล่าสุด",
              value: "22",
              icon: <Star className="w-7 h-7" />,
              color: "indigo",
              change: "+5%",
              bg: "from-indigo-500 to-blue-500",
            },
            {
              label: "ระบบออนไลน์",
              value: "99.9%",
              icon: <Zap className="w-7 h-7" />,
              color: "teal",
              change: "stable",
              bg: "from-teal-500 to-cyan-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 border border-white/50 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.bg} text-white shadow-xl group-hover:scale-125 transition-transform duration-500`}>
                    {stat.icon}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-bold ${typeof stat.change === "string" && stat.change.includes("+")
                        ? "bg-green-100 text-green-700"
                        : typeof stat.change === "string" && stat.change.includes("-")
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      } shadow-lg`}
                  >
                    {stat.change}
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-semibold text-lg">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Ultra Modern Menu Cards (now using Link for real navigation) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`group relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 ${item.delay} border border-white/50 cursor-pointer overflow-hidden transform hover:-translate-y-6 hover:rotate-1 focus:outline-none focus:ring-4 focus:ring-cyan-300`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full opacity-30 group-hover:scale-125 transition-transform duration-1000"></div>

              <div className="absolute inset-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-ping"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: `${15 + i * 20}%`,
                      animationDelay: `${i * 200}ms`,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 p-10">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="group-hover:scale-125 transition-transform duration-500 drop-shadow-2xl filter text-gray-800 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div
                      className={`absolute -bottom-3 -right-3 w-8 h-8 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-xl animate-pulse`}
                    >
                      {item.stats.recent}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-8 font-medium">
                    {item.description}
                  </p>

                  <div className="flex justify-center space-x-6 mb-8">
                    <div className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-2xl transition-colors">
                      <span className="font-bold text-gray-700 text-sm">ทั้งหมด: {item.stats.total}</span>
                    </div>
                    <div className={`bg-gradient-to-r ${item.gradient} text-white px-4 py-2 rounded-2xl shadow-lg`}>
                      <span className="font-bold text-sm">ใหม่: {item.stats.recent}</span>
                    </div>
                  </div>

                  <div className={`inline-flex items-center justify-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 group-hover:${item.gradient} group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-2xl`}>
                    <span className="font-bold text-lg">เข้าจัดการ</span>
                    <svg
                      className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Ultra Modern Overview Section */}
        <div
          className={`transition-all duration-1000 delay-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/50 to-indigo-50/50"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/30 to-cyan-100/30 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-100/30 to-blue-100/30 rounded-full translate-y-40 -translate-x-40"></div>

            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 400}ms`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl py-3 px-8 mb-8 shadow-xl">
                  <Heart className="w-6 h-6" />
                  <span className="font-bold text-lg">ภาพรวมระบบ</span>
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                  ระบบจัดการสุขภาพ
                </h3>
                <p className="text-gray-700 text-xl max-w-4xl mx-auto leading-relaxed font-medium">
                  ระบบจัดการเนื้อหาสุขภาพที่ครอบคลุมและใช้งานง่าย เพื่อการให้บริการข้อมูลสุขภาพที่มีคุณภาพแก่ผู้ใช้
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold text-2xl">
                    พร้อมการวิเคราะห์และรายงานแบบเรียลไทม์
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {[
                  {
                    label: "ข่าวสาร",
                    value: "24",
                    icon: <Newspaper className="w-8 h-8" />,
                    trend: "+15%",
                    color: "blue",
                    bg: "from-blue-400 to-cyan-400",
                  },
                  {
                    label: "เมนูอาหาร",
                    value: "156",
                    icon: <Utensils className="w-8 h-8" />,
                    trend: "+8%",
                    color: "green",
                    bg: "from-green-400 to-emerald-400",
                  },
                  {
                    label: "วัตถุดิบ",
                    value: "89",
                    icon: <ClipboardList className="w-8 h-8" />,
                    trend: "+12%",
                    color: "orange",
                    bg: "from-orange-400 to-amber-400",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="group text-center p-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-white/60 relative overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color === "blue"
                          ? "from-blue-500/5 to-cyan-500/5"
                          : stat.color === "green"
                            ? "from-green-500/5 to-emerald-500/5"
                            : "from-orange-500/5 to-amber-500/5"
                        } group-hover:opacity-100 opacity-0 transition-opacity duration-500`}
                    ></div>

                    <div className="relative z-10">
                      <div className="relative inline-block mb-6">
                        <div className="text-5xl group-hover:scale-125 transition-transform duration-500 drop-shadow-lg flex items-center justify-center text-gray-800">
                          {stat.icon}
                        </div>
                        <div
                          className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${stat.bg} rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg`}
                        >
                          ↗
                        </div>
                      </div>
                      <div className="text-4xl font-black text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                        {stat.value}
                      </div>
                      <div className="text-gray-600 font-bold text-lg mb-4">{stat.label}</div>
                      <div className="inline-block text-green-600 text-sm font-bold bg-green-100 px-4 py-2 rounded-full shadow-lg">
                        {stat.trend} เดือนนี้
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
