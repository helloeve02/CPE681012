import React from "react";
import { Link } from "react-router-dom";

const NewsCategoryPage: React.FC = () => {
  const categories = [
    { label: "โรคไต", path: "/KidneyInformation" },
    { label: "โรคเบาหวาน", path: "/DiabetesInformation" },
    { label: "ออกกำลังกาย", path: "/ExerciseInformation" },
    { label: "โภชนาการ", path: "/NutritionInformation" },
  ];

  const infographics = [
    { img: "https://via.placeholder.com/200x300", title: "4 วิธีสำรองน้ำ รับมือหน้าฝน" },
    { img: "https://via.placeholder.com/200x300", title: "กรมอนามัย ขอเสนอแนวทาง การจัดการขยะ กรณีบ้านถูกน้ำท่วม" },
    { img: "https://via.placeholder.com/200x300", title: "DING DONG นี่อย่าทำเองนะ...คุณผู้ชาย" },
    { img: "https://via.placeholder.com/200x300", title: "10 วิธีดูแลพระสงฆ์ / พระภิกษุในช่วงน้ำท่วม" },
  ];

  const videos = [
    {
      id: "1",
      img: "https://via.placeholder.com/300x180",
      title: "การรื้อล้างทำความสะอาดห้องปลอดฝุ่น",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: "2",
      img: "https://via.placeholder.com/300x180",
      title: "6 ขั้นต้องรู้ ดูแลตนเองให้ห่างไกลโรค",
      videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    },
    {
      id: "3",
      img: "https://via.placeholder.com/300x180",
      title: "5 ข้อปฏิบัติ ป้องกันโรค",
      videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
    },
  ];

  const articles = [
    {
      img: "https://via.placeholder.com/400x300",
      category: "สาระสุขภาพ",
      title: "ตัวอย่างเมนูสุขภาพ สำหรับตักบาตร (วันศุกร์)",
      description: "เนื่องในสัปดาห์หน้า เป็นสัปดาห์แห่ง วิสาขบูชา กรมอนามัย อยากชวนมาทำบุญด้วยการตักบาตร...",
    },
    {
      img: "https://via.placeholder.com/400x300",
      category: "อินโฟกราฟฟิก",
      title: "4 วิธีสำรองน้ำ รับมือหน้าฝน",
      description: "เรียนรู้วิธีการสำรองน้ำอย่างปลอดภัย เพื่อรับมือกับฤดูฝน...",
    },
    {
      img: "https://via.placeholder.com/400x300",
      category: "อินโฟกราฟฟิก",
      title: "กรมอนามัย ขอเสนอแนวทาง การจัดการขยะ กรณีบ้านถูกน้ำท่วม",
      description: "ข้อแนะนำการจัดการขยะและสุขาภิบาล หลังเหตุการณ์น้ำท่วม...",
    },
    {
      img: "https://via.placeholder.com/400x300",
      category: "อินโฟกราฟฟิก",
      title: "DING DONG นี่อย่าทำเองนะ...คุณผู้ชาย",
      description: "ข้อมูลความปลอดภัยสำหรับคุณผู้ชายในสถานการณ์ฉุกเฉิน...",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 py-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        
        {/* หัวข้อหลัก */}
        <h1 className="text-center text-3xl font-bold text-blue-600 mb-8 border-b pb-4">
          สาระความรู้
        </h1>

        {/* ส่วนหมวดหมู่ */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              สาระความรู้ สำหรับผู้ป่วยและผู้ใช้ทั่วไป
            </h2>
            <p className="text-gray-600 mb-4">
              อัพเดทสาระความรู้ที่ทันสมัย ให้คุณเข้าใจได้ง่าย ไม่ตกเทรนด์
            </p>
            <p className="font-medium mb-2">หมวดหมู่</p>
            <div className="flex flex-wrap gap-3">
              {categories.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="bg-gray-200 hover:bg-blue-100 hover:text-blue-700 transition px-4 py-2 rounded-md text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://get-up-lauf.at/wp-content/uploads/sites/112/2018/01/1441275349035.jpg"
              alt="อาหารสุขภาพ"
              className="rounded-lg object-cover w-full h-[280px]"
            />
          </div>
        </div>

        {/* อินโฟกราฟฟิก */}
        <Section title="อินโฟกราฟฟิก" items={infographics} type="card" />

        {/* วิดีโอล่าสุด */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">วิดีโอล่าสุด</h3>
            <a href="/VideoInformation" className="text-blue-500 hover:underline text-sm">
              ดูเพิ่มเติม &gt;
            </a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {videos.map((video) => (
              <Link
                key={video.id}
                to={`/video/${video.id}`}
                className="w-64 bg-white rounded-lg shadow hover:shadow-md hover:scale-105 transition flex-shrink-0 overflow-hidden"
              >
                <img
                  src={video.img}
                  alt={video.title}
                  className="h-40 w-full object-cover"
                />
                <p className="text-sm p-2 line-clamp-2">{video.title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* บทความ */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">บทความ</h3>
            <a href="/ArticleInformation" className="text-blue-500 hover:underline text-sm">
              ดูเพิ่มเติม &gt;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition transform overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <p className="text-xs font-bold text-gray-500">{item.category}</p>
                  <h3 className="text-sm font-bold mt-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  items: { img: string; title: string }[];
  type: "card" | "video";
}

const Section: React.FC<SectionProps> = ({ title, items, type }) => (
  <div className="mt-10">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <a href="/InfographicInformation" className="text-blue-500 hover:underline text-sm">
        ดูเพิ่มเติม &gt;
      </a>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`${
            type === "video" ? "w-64 cursor-pointer" : "w-48"
          } bg-white rounded-lg shadow hover:shadow-md hover:scale-105 transition flex-shrink-0 overflow-hidden`}
        >
          <img
            src={item.img}
            alt={item.title}
            className={`${type === "video" ? "h-40" : "h-60"} w-full object-cover`}
          />
          <p className="text-sm p-2 line-clamp-2">{item.title}</p>
        </div>
      ))}
    </div>
  </div>
);

export default NewsCategoryPage;
