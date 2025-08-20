// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// // import { FaArrowLeft, FaYoutube } from "react-icons/fa";

// interface MediaItem {
//   title: string;
//   date: string;
//   group: string;
//   youtubeId?: string; // ใช้ในอนาคต
// }

// const MediaNewsPage: React.FC = () => {
//   const navigate = useNavigate();

//   // สมมุติข้อมูลวิดีโอ เรียกจาก API ได้ในอนาคต
//   const [mediaData, setMediaData] = useState<MediaItem[]>([]);

//   useEffect(() => {
//     // ดึงข้อมูล (mock)
//     const fetched = [
//       { title: "เสริมความรู้เรื่องไข้", date: "14 กรกฎาคม 2568", group: "กลุ่มวัยเรียน", youtubeId: "dQw4w9WgXcQ" },
//       { title: "อาหารที่ควรรับประทาน", date: "14 กรกฎาคม 2568", group: "กลุ่มวัยทำงาน", youtubeId: "dQw4w9WgXcQ" },
//       { title: "การดูแลสุขภาพเบื้องต้น", date: "13 กรกฎาคม 2568", group: "กลุ่มผู้สูงอายุ" , youtubeId: "dQw4w9WgXcQ"},
//       { title: "โรคติดต่อในเด็ก", date: "12 กรกฎาคม 2568", group: "กลุ่มเด็ก" , youtubeId: "dQw4w9WgXcQ"},
//       { title: "การนอนหลับที่ดี", date: "11 กรกฎาคม 2568", group: "กลุ่มวัยรุ่น" , youtubeId: "dQw4w9WgXcQ"},
//       { title: "การนอนหลับที่ดี", date: "11 กรกฎาคม 2568", group: "กลุ่มวัยรุ่น" , youtubeId: "dQw4w9WgXcQ"},
//     ];
//     setMediaData(fetched);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 flex flex-col items-center py-4 px-4">
//       {/* Header */}
//       <div className="flex items-center justify-between w-full max-w-7xl text-white mb-4">
//         <button onClick={() => navigate(-1)} className="text-white text-xl hover:scale-110 transition">
//           {/* <FaArrowLeft /> */}
//         </button>
//         <h1 className="text-lg font-bold text-center flex-1 -ml-5 sm:text-xl">ข่าวสาร</h1>
//         <div className="w-6" />
//       </div>

//       {/* Content box */}
//       <div className="bg-white w-full max-w-7xl rounded-2xl shadow-lg p-4 space-y-6 min-h-screen">
//         {/* Header row */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//           <h2 className="text-base font-semibold text-gray-800">สื่อมัลติมีเดีย</h2>
//           <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//             <label className="text-sm font-medium text-gray-700">เลือกหมวดหมู่ข่าวสาร</label>
//             <select className="rounded-md border border-gray-300 text-sm px-3 py-2">
//               <option>ทั้งหมด</option>
//               <option>เด็ก</option>
//               <option>วัยรุ่น</option>
//               <option>ผู้สูงอายุ</option>
//             </select>
//           </div>
//         </div>

//         {/* Media Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {mediaData.map((item, index) => (
//             <div key={index} className="bg-gray-100 rounded-xl shadow overflow-hidden flex flex-col">
//               {/* ถ้ามี YouTube ID แสดงวิดีโอจริง */}
//               {item.youtubeId ? (
//                 <iframe
//                   className="w-full h-40"
//                   src={`https://www.youtube.com/embed/${item.youtubeId}`}
//                   title={item.title}
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 />
//               ) : (
//                 <div className="h-40 flex items-center justify-center bg-gray-300">
//                   {/* <FaYoutube className="text-red-600 text-5xl" /> */}
//                 </div>
//               )}
//               <div className="bg-white px-4 py-3 text-sm flex flex-col gap-1">
//                 <p className="text-gray-600 font-semibold">{item.date}</p>
//                 <p className="text-gray-800 font-medium">{item.title}</p>
//                 <p className="text-gray-500">{item.group}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MediaNewsPage;
