import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { EducationalContentInterface } from "../../interfaces/EducationalContent ";
import { GetContentByID } from "../../services/https";

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contentByID, setContentByID] = useState<EducationalContentInterface | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        const res = await GetContentByID(id);
        // สมมติ API ส่ง object เดียว
        setContentByID(res.data.menu ?? res.data); 
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    };
    fetchContent();
  }, [id]);

  if (!contentByID) return <div>Loading...</div>;

  // แปลงลิงค์ YouTube ให้เป็น embed
  const embedLink = contentByID.Link?.replace("watch?v=", "embed/") ?? "";

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        
        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-3">{contentByID.Title}</h1>

          {/* VIDEO SECTION */}
          <div className="relative w-full pb-[56.25%] mb-6 rounded-xl overflow-hidden shadow-md">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={embedLink}
              title={contentByID.Title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          {/* DESCRIPTION */}
          <div className="text-gray-700 leading-relaxed space-y-4 text-lg">
            <p>{contentByID.Description}</p>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">วิดีโอที่เกี่ยวข้อง</h2>

          <div className="grid gap-4">
            {[ // ตัวอย่างวิดีโอที่เกี่ยวข้อง
              {
                title: "6 ขั้นตอนต้องรู้ ดูแลตนเอง ให้ช่วงที่เมืองมีฝุ่น PM2.5",
                date: "29 มกราคม 2568",
                img: "https://via.placeholder.com/120x80"
              },
              {
                title: "5 ข้อ ป้องกันฝุ่น PM2.5",
                date: "29 มกราคม 2568",
                img: "https://via.placeholder.com/120x80"
              },
              {
                title: "วิธีเลือกหน้ากากอนามัย ป้องกันฝุ่น PM2.5",
                date: "17 เมษายน 2567",
                img: "https://via.placeholder.com/120x80"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white p-2 rounded-lg shadow hover:shadow-md transition"
              >
                <img
                  src={item.img}
                  alt="thumbnail"
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VideoDetailPage;
