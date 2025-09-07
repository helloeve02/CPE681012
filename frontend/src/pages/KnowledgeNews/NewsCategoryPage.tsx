import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { EducationalContentInterface } from "../../interfaces/EducationalContent ";
import {
  GetContentByArticle,
  GetContentByInfographics,
  GetContentByVideo,
} from "../../services/https";
import { ArrowLeft } from "lucide-react";

const NewsCategoryPage: React.FC = () => {
  const [infographics, setInfographics] = useState<EducationalContentInterface[]>([]);
  const [video, setVideo] = useState<EducationalContentInterface[]>([]);
  const [article, setArticle] = useState<EducationalContentInterface[]>([]);
const navigate = useNavigate();
  const categories = [
    { label: "โรคไต", path: "/KidneyInformation", icon: "🫘", color: "bg-emerald-500" },
    { label: "โรคเบาหวาน", path: "/DiabetesInformation", icon: "🩺", color: "bg-red-500" },
    { label: "ออกกำลังกาย", path: "/ExerciseInformation", icon: "💪", color: "bg-orange-500" },
    { label: "โภชนาการ", path: "/NutritionInformation", icon: "🥗", color: "bg-green-500" },
  ];

  const getContentByInfographics = async () => {
    try {
      const res = await GetContentByInfographics();
      if (Array.isArray(res?.data?.educationalContents)) {
        setInfographics(res.data.educationalContents);
      }
    } catch (error) {
      console.error("Error fetching infographics:", error);
    }
  };

  const getContentByVideo = async () => {
    try {
      const res = await GetContentByVideo();
      if (Array.isArray(res?.data?.educationalContents)) {
        setVideo(res.data.educationalContents);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const getContentByArticle = async () => {
    try {
      const res = await GetContentByArticle();
      if (Array.isArray(res?.data?.educationalContents)) {
        setArticle(res.data.educationalContents);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    getContentByInfographics();
    getContentByVideo();
    getContentByArticle();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
            >
              <ArrowLeft size={22} />
            </button>
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              สาระความรู้
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              อัพเดทสาระความรู้ที่ทันสมัย ให้คุณเข้าใจได้ง่าย ไม่ตกเทรนด์
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {/* Categories Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                สำหรับผู้ป่วยและผู้ใช้ทั่วไป
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                เลือกหมวดหมู่ที่สนใจ
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                ค้นหาความรู้ที่ตรงกับความต้องการของคุณ
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    className="group relative overflow-hidden bg-white border-2 border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 rounded-xl p-4 text-center hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 lg:max-w-md">
              <div className="relative">
                <img
                  src="https://get-up-lauf.at/wp-content/uploads/sites/112/2018/01/1441275349035.jpg"
                  alt="อาหารสุขภาพ"
                  className="rounded-2xl object-cover w-full h-80 shadow-lg"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Infographics Section */}
        <CarouselSection
          title="อินโฟกราฟฟิก"
          subtitle="ข้อมูลที่เข้าใจง่าย ผ่านภาพประกอบ"
          items={infographics.map((item) => ({
            id: item.ID,
            img: item.PictureOut ?? item.PictureIn ?? "",
            title: item.Title ?? "",
          }))}
          type="card"
          linkTo="/InfographicInformation"
          icon="📊"
        />

        {/* Videos Section */}
        <CarouselSection
          title="วิดีโอล่าสุด"
          subtitle="เรียนรู้ผ่านคลิปวิดีโอที่น่าสนใจ"
          items={video.map((item) => ({
            id: item.ID,
            img: item.PictureOut ?? item.PictureIn ?? "",
            title: item.Title ?? "",
          }))}
          type="video"
          linkTo="/VideoInformation"
          icon="🎥"
        />

        {/* Articles Section */}
        <div className="mt-16 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📰</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">บทความ</h3>
                <p className="text-gray-600 text-sm">อ่านบทความเชิงลึกเพื่อความรู้ที่ครบถ้วน</p>
              </div>
            </div>
            <Link
              to="/ArticleInformation"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
            >
              ดูเพิ่มเติม
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-screen-xl mx-auto justify-items-center">
            {article.slice(0, 8).map((item) => (
              <Link
                key={item.ID}
                to={`/article/${item.ID}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.PictureOut ?? "/default-image.jpg"}
                    alt={item.Title ?? ""}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-gray-800 mb-2 line-clamp-2 leading-snug">
                    {item.Title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {item.Description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CarouselSectionProps {
  title: string;
  subtitle?: string;
  items: { id: number; img: string; title: string }[];
  type: "card" | "video";
  linkTo?: string;
  icon?: string;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ title, subtitle, items, type, linkTo = "#", icon }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const cardWidth = type === "video" ? 320 : 256; // w-80 = 320px, w-64 = 256px
  const gap = 24; // gap-6 = 24px

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = cardWidth + gap;
      const currentScrollLeft = scrollContainerRef.current.scrollLeft;
      const newScrollLeft = direction === 'left' 
        ? currentScrollLeft - scrollAmount 
        : currentScrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {icon && <span className="text-3xl">{icon}</span>}
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
          </div>
        </div>
        
        <Link
          to={linkTo}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
        >
          ดูเพิ่มเติม
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        {items.length > 3 && (
          <button
            onClick={() => scrollTo('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 ${
              canScrollLeft 
                ? 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
            style={{ marginLeft: '-20px' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {items.length > 3 && (
          <button
            onClick={() => scrollTo('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 ${
              canScrollRight 
                ? 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
            style={{ marginRight: '-20px' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              to={type === "video" ? `/video/${item.id}` : `/infographic/${item.id}`}
              className={`group ${type === "video" ? "w-80" : "w-64"} bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 overflow-hidden border border-gray-100 hover:scale-105`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className={`${type === "video" ? "h-48" : "h-64"} w-full object-cover group-hover:scale-110 transition-transform duration-300`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 line-clamp-2 leading-snug">
                  {item.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsCategoryPage;