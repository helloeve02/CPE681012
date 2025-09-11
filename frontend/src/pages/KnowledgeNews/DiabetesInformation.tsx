import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText, Video, Image, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { EducationalContentInterface } from "../../interfaces/EducationalContent ";
import { GetContentAllByDiabetes, GetContentDiabetesByArticle, GetContentDiabetesByInfographics, GetContentDiabetesByVideo } from "../../services/https";

const DiabetesInformation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [diabetes, setDiabetes] = useState<EducationalContentInterface[]>([]);
  const [DiabetesByInfographics, setDiabetesByInfographics] = useState<EducationalContentInterface[]>([]);
  const [DiabetesByArticle, setDiabetesByArticle] = useState<EducationalContentInterface[]>([]);
  const [DiabetesByVideo, setDiabetesByVideo] = useState<EducationalContentInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const tabs = [
    { id: "ทั้งหมด", label: "ทั้งหมด", icon: Sparkles },
    { id: "บทความ", label: "บทความ", icon: FileText },
    { id: "คลังวิดีโอ", label: "คลังวิดีโอ", icon: Video },
    { id: "อินโฟกราฟฟิก", label: "อินโฟกราฟฟิก", icon: Image }
  ];

  const getContentAllByDiabetes = async () => {
    try {
      setIsLoading(true);
      const res = await GetContentAllByDiabetes();
      if (Array.isArray(res?.data?.educationalContents)) {
        setDiabetes(res.data.educationalContents);
      }
    } catch (error) {
      console.error("Error fetching diabetes content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getContentDiabetesByInfographics = async () => {
    try {
      setIsLoading(true);
      const res = await GetContentDiabetesByInfographics();
      if (Array.isArray(res?.data?.educationalContents)) {
        setDiabetesByInfographics(res.data.educationalContents);
      }
    } catch (error) {
      console.error("Error fetching diabetes content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getContentDiabetesByArticle = async () => {
    try {
      setIsLoading(true);
      const res = await GetContentDiabetesByArticle();
      if (Array.isArray(res?.data?.educationalContents)) {
        setDiabetesByArticle(res.data.educationalContents);
      }
    } catch (error) {
      console.error("Error fetching diabetes content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getContentDiabetesByVideo = async () => {
    try {
      setIsLoading(true);
      const res = await GetContentDiabetesByVideo();
      if (Array.isArray(res?.data?.educationalContents)) {
        setDiabetesByVideo(res.data.educationalContents);
      }
    } catch (error) {
      console.error("Error fetching diabetes content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันสำหรับนำทางไปยังหน้ารายละเอียด
  const handleContentClick = (contentId: string | number, categoryId?: number) => {
    switch (categoryId) {
      case 2: // วิดีโอ
        navigate(`/video/${contentId}`);
        break;
      case 1: // บทความ
        navigate(`/article/${contentId}`);
        break;
      case 3: // อินโฟกราฟฟิก
        navigate(`/infographic/${contentId}`);
        break;
      default: // ถ้าไม่ตรง category ไหนเลย
        navigate(`/diabetes-detail/${contentId}`);
    }
  };

  useEffect(() => {
    getContentAllByDiabetes();
    getContentDiabetesByArticle();
    getContentDiabetesByInfographics();
    getContentDiabetesByVideo();
  }, []);

  // Filter by active tab
  let filteredData: EducationalContentInterface[] = [];

  if (activeTab === "ทั้งหมด") {
    filteredData = diabetes;
  } else if (activeTab === "บทความ") {
    filteredData = DiabetesByArticle;
  } else if (activeTab === "คลังวิดีโอ") {
    filteredData = DiabetesByVideo;
  } else if (activeTab === "อินโฟกราฟฟิก") {
    filteredData = DiabetesByInfographics;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Header Navigation */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="flex-1 text-center text-white font-bold text-xl tracking-wide">
              ข่าวสาร
            </h1>
            <div className="w-12" />
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 border border-white/20">
              <span className="text-4xl">🩺</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              โรคเบาหวาน
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
              ค้นพบข้อมูลโรคเบาหวานที่เป็นประโยชน์ต่อสุขภาพของคุณ อัพเดทความรู้ใหม่ๆ ให้ทันสมัยเสมอ
            </p>
          </div>
        </div>

        {/* Wave Bottom */}
        {/* <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div> */}
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full text-purple-700 text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              เนื้อหาโรคเบาหวาน
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">เลือกประเภทเนื้อหา</h3>
            <p className="text-gray-600">เลือกประเภทเนื้อหาที่คุณสนใจเพื่อเรียนรู้เพิ่มเติม</p>
          </div>

          <div className="px-4 pb-4">
            <div className="flex bg-gray-100/80 rounded-xl p-1 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-white text-purple-700 shadow-lg shadow-purple-500/20 border border-purple-200/50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline font-semibold">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-6"></div>
              <p className="text-gray-600 text-lg font-medium">กำลังโหลดข้อมูล...</p>
              <p className="text-gray-400 text-sm mt-1">รอสักครู่นะคะ</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="text-gray-400" size={48} />
              </div>
              <h4 className="text-xl font-bold text-gray-500 mb-2">ไม่มีข้อมูลในหมวดหมู่นี้</h4>
              <p className="text-gray-400 text-center max-w-md">
                ขออพัยครับ ยังไม่มีเนื้อหาในหมวดหมู่ที่เลือก ลองเลือกหมวดหมู่อื่นดูสิ
              </p>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {activeTab === "ทั้งหมด" ? "เนื้อหาทั้งหมด" : activeTab}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    พบ {filteredData.length} รายการ
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>เรียงตาม:</span>
                  <span className="font-medium text-gray-700">ล่าสุด</span>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredData.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleContentClick(item.ID || idx, item.ContentCategoryID)}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 cursor-pointer"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.PictureOut || item.PictureIn}
                        alt={item.Title ?? ""}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Content type badge */}
                      <div className="absolute top-3 right-3 bg-purple-500/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/20">
                        {item.type}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 text-base leading-tight mb-3 group-hover:text-purple-700 transition-colors duration-200 line-clamp-2">
                        {item.Title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                        {item.Description}
                      </p>
                      
                      {/* Read more indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span>อ่านเพิ่มเติม</span>
                          <ArrowLeft className="ml-2 rotate-180" size={14} />
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date().toLocaleDateString('th-TH')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiabetesInformation;