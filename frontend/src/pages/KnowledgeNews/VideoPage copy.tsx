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
        console.log(res?.data?.menu)
        setContentByID(res.data.menu); // ปรับตาม API
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    };
    fetchContent();
  }, [id]);

  if (!contentByID) return <div>Loading...</div>;

  const embedLink = contentByID.Link?.replace("watch?v=", "embed/") ?? "";

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-3">{contentByID.Title}</h1>
          <div className="text-gray-500 text-sm mb-6 flex items-center gap-6">
            <span>📅 29 มกราคม 2568</span>
            <span>👁  Views: 633</span>
          </div>
          <div className="relative w-full pb-[56.25%] mb-6 rounded-xl overflow-hidden shadow-md">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={embedLink}
              title={contentByID.Title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <div className="text-gray-700 leading-relaxed space-y-4 text-lg">
            <p>{contentByID.Description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;
