import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AssessmentSlider from "../../components/AssessmentSlider";

const images = [
  {
    src: "https://healthmedia.hss.moph.go.th/wp-content/uploads/2025/06/2025-06-13_13-42-56_717798.jpg",
    alt: "ข่าวสาร 1",
    title: "เคล็ดลับการดูแลสุขภาพในยุคใหม่",
    description: "เทคนิคใหม่ๆ ในการดูแลสุขภาพให้แข็งแรงอย่างยั่งยืน"
  },
  {
    src: "https://www.ddc.moph.go.th/uploads/publish/1727420250801113442.jpg",
    alt: "ข่าวสาร 2",
    title: "โภชนาการที่ถูกต้องสำหรับทุกวัย",
    description: "แนวทางการเลือกอาหารที่เหมาะสมกับแต่ละช่วงวัย"
  },
  {
    src: "https://thaincd.com/images/media/info/NCD/%E0%B9%80%E0%B8%9A%E0%B8%B2%E0%B8%AB%E0%B8%A7%E0%B8%B2%E0%B8%99%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B8%A7%E0%B8%B1%E0%B8%93%E0%B9%82%E0%B8%A3%E0%B8%841.jpg",
    alt: "ข่าวสาร 3",
    title: "ป้องกันโรคเบาหวานด้วยวิธีธรรมชาติ",
    description: "วิธีการป้องกันและจัดการโรคเบาหวานอย่างมีประสิทธิภาพ"
  },
];

const HomePage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 font-kanit">
      <div className="p-6 w-full max-w-[1450px] mx-auto space-y-16">
        {/* Hero Section with Enhanced Carousel */}
        <section className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                สาระความรู้
              </h2>
              <p className="text-gray-600 text-lg">ข้อมูลสุขภาพล่าสุดสำหรับคุณ</p>
            </div>
            <Link
              to="selectnewscategorypage"
              className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span className="font-medium">ดูทั้งหมด</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-white">
            {/* Main Image */}
            <div className="relative h-[300px] sm:h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden">
              <img
                src={images[current].src}
                alt={images[current].alt}
                className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="max-w-3xl">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 drop-shadow-lg">
                  {images[current].title}
                </h3>
                <p className="text-lg opacity-90 drop-shadow-md leading-relaxed">
                  {images[current].description}
                </p>
              </div>
            </div>

            {/* Enhanced Dots */}
            <div className="absolute bottom-6 right-8 flex space-x-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    current === idx 
                      ? "bg-white scale-125 shadow-lg" 
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-6000 ease-linear"
                style={{ 
                  width: `${((current + 1) / images.length) * 100}%`
                }}
              />
            </div>
          </div>
        </section>

        {/* Enhanced Recommended Section */}
        <section className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              รายการแนะนำ
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              เครื่องมือและบริการที่จะช่วยให้คุณดูแลสุขภาพได้อย่างมีประสิทธิภาพ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { 
                title: "โภชนาการที่เหมาะกับคุณ", 
                icon: "🥗", 
                path: "/nutrition",
                description: "วิเคราะห์โภชนาการส่วนบุคคล",
                gradient: "from-green-400 to-blue-500",
                delay: "delay-100"
              },
              { 
                title: "เมนูอาหารแนะนำ", 
                icon: "🍽️", 
                path: "/menu",
                description: "เมนูอาหารสุขภาพที่หลากหลาย",
                gradient: "from-purple-400 to-pink-500",
                delay: "delay-200"
              },
              { 
                title: "แผนมื้ออาหาร", 
                icon: "📅", 
                path: "/mealplanner",
                description: "วางแผนอาหารรายวันอย่างเป็นระบบ",
                gradient: "from-orange-400 to-red-500",
                delay: "delay-300"
              },
            ].map((item, index) => (
              <Link to={item.path} key={index}>
                <div className={`group bg-white rounded-3xl shadow-xl p-8 h-full min-h-[200px] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${item.delay} border border-gray-100 relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                    <div className={`w-full h-full bg-gradient-to-br ${item.gradient}`} />
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500" />
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500" />
                  
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* Arrow Icon */}
                    <div className="mt-4 p-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                      <svg className="w-5 h-5 text-purple-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Enhanced Assessment Section */}
        <section className={`transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              แบบประเมินสุขภาพ
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              ประเมินสุขภาพของคุณด้วยแบบทดสอบที่ได้มาตรฐาน เพื่อให้คำแนะนำที่เหมาะสมกับคุณ
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-50 to-blue-50 rounded-full -translate-y-32 translate-x-32 opacity-50" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-50 to-cyan-50 rounded-full translate-y-24 -translate-x-24 opacity-50" />
            
            <div className="relative z-10">
              <AssessmentSlider />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;