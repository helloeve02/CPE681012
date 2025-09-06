import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { EducationalContentInterface } from "../../interfaces/EducationalContent ";
import { GetContentByID, GetContentByVideo } from "../../services/https";
import { ArrowLeft } from "lucide-react";

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contentByID, setContentByID] = useState<EducationalContentInterface | null>(null);
  const [video, setVideo] = useState<EducationalContentInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const getContentByVideo = async () => {
    try {
      const res = await GetContentByVideo();
      if (Array.isArray(res?.data?.educationalContents)) {
        // Filter out current video and limit to 6 items
        const filtered = res.data.educationalContents
          .filter((item: { ID: number; }) => item.ID !== parseInt(id || '0'))
          .slice(0, 6);
        setVideo(filtered);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        const res = await GetContentByID(id);
        setContentByID(res.data.menu ?? res.data);
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  useEffect(() => {
    getContentByVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-lg">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!contentByID) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบข้อมูล</h2>
            <p className="text-gray-600 mb-6">ไม่สามารถหาวิดีโอที่คุณต้องการได้</p>
            <Link
              to="/VideoInformation"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              กลับไปหน้าวิดีโอ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // แปลงลิงค์ YouTube ให้เป็น embed
  const embedLink = contentByID.Link?.replace("watch?v=", "embed/") ?? "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-blue-100">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link to="/VideoInformation" className="hover:text-white transition-colors">
                  วิดีโอ
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium truncate">{contentByID.Title}</li>
            </ol>
          </nav>
          <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
            >
              <ArrowLeft size={22} />
            </button>
        </div>  
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {/* Page Title Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-4">
              <span className="text-xl">🎥</span>
              รายละเอียดวิดีโอ
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {contentByID.Title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2">
              {/* Video Container */}
              <div className="relative bg-white rounded-xl overflow-hidden border border-gray-100">
                <div className="relative w-full pb-[56.25%] bg-gray-900 rounded-lg overflow-hidden">
                  {embedLink ? (
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={embedLink}
                      title={contentByID.Title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎥</div>
                        <p className="text-gray-600">ไม่สามารถโหลดวิดีโอได้</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info Bar */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        วิดีโอสำหรับการเรียนรู้
                      </span>
                    </div>
                    {contentByID.Link && (
                      <a
                        href={contentByID.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        ดูใน YouTube
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white rounded-xl border border-gray-100 mt-2 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700 text-sm font-medium">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    รายละเอียด
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 leading-relaxed text-lg">
                    {contentByID.Description}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-4">
                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      แชร์วิดีโอ
                    </button>
                    <button className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      บันทึก
                    </button>
                    <button className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m-6 0h8m0 0v2m0-2H7m8 0a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h8z" />
                      </svg>
                      เพิ่มในเพลย์ลิสต์
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Related Videos */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🎥</span>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">วิดีโอที่เกี่ยวข้อง</h2>
                    <p className="text-gray-600 text-sm">วิดีโอน่าสนใจอื่นๆ</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {video.length > 0 ? (
                    video.map((item) => (
                      <div
                        key={item.ID}
                        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-md"
                        onClick={() => navigate(`/video/${item.ID}`)}
                      >
                        <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                          <img
                            src={item.PictureOut || "https://via.placeholder.com/120x80"}
                            alt={item.Title}
                            className="w-20 h-15 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                            {item.Title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                            {item.Description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🔍</div>
                      <p className="text-sm">ไม่มีวิดีโอที่เกี่ยวข้อง</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link
                    to="/VideoInformation"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors w-full justify-center"
                  >
                    ดูวิดีโอทั้งหมด
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-center">
                  <div className="text-3xl mb-3">📚</div>
                  <h3 className="font-bold text-gray-800 mb-2">เรียนรู้เพิ่มเติม</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    สำรวจเนื้อหาอื่นๆ ที่น่าสนใจ
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/InfographicInformation"
                      className="bg-white text-gray-700 px-3 py-2 rounded-lg hover:shadow-md transition-all duration-300 text-sm font-medium border border-gray-200 hover:border-gray-300"
                    >
                      📊 อินโฟ
                    </Link>
                    <Link
                      to="/ArticleInformation"
                      className="bg-white text-gray-700 px-3 py-2 rounded-lg hover:shadow-md transition-all duration-300 text-sm font-medium border border-gray-200 hover:border-gray-300"
                    >
                      📰 บทความ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;