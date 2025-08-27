import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { EducationalContentInterface } from "../../interfaces/EducationalContent ";
import { GetContentByID, GetContentByInfographics } from "../../services/https";

const InfographicDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [infographic, setInfographic] = useState<EducationalContentInterface | null>(null);
  const [related, setRelated] = useState<EducationalContentInterface[]>([]);

  const fetchInfographic = async () => {
    if (!id) return;
    try {
      const res = await GetContentByID(id);
      setInfographic(res.data.menu ?? res.data);
    } catch (err) {
      console.error("Error fetching infographic:", err);
    }
  };

  const fetchRelatedInfographics = async () => {
    try {
      const res = await GetContentByInfographics();
      if (Array.isArray(res?.data?.educationalContents)) {
        setRelated(res.data.educationalContents);
      }
    } catch (error) {
      console.error("Error fetching related infographics:", error);
    }
  };

  useEffect(() => {
    fetchInfographic();
    fetchRelatedInfographics();
  }, [id]);

  if (!infographic) return <div>Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        
        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-4">{infographic.Title}</h1>
          <img
            src={infographic.PictureIn || ""}
            alt={infographic.Title}
            className="w-full rounded-xl shadow-md mb-6"
          />
          <div className="text-gray-700 text-lg leading-relaxed">
            <p>{infographic.Description}</p>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">อินโฟกราฟฟิกที่เกี่ยวข้อง</h2>
          <div className="grid gap-4">
            {related.map((item) => (
              <div
                key={item.ID}
                className="flex items-start gap-3 bg-white p-2 rounded-lg shadow hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/infographic/${item.ID}`)}
              >
                <img
                  src={item.PictureIn || "https://via.placeholder.com/120x80"}
                  alt={item.Title}
                  className="w-24 h-16 object-cover rounded"
                />
                
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default InfographicDetailPage;
