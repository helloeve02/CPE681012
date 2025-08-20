// import React from "react";
// import { useNavigate } from "react-router-dom";
// // import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// const infographicData = [
//   {
//     id: 1,
//     image: "https://via.placeholder.com/150x150.png?text=Info1",
//     description: "ข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูล",
//   },
//   {
//     id: 2,
//     image: "https://via.placeholder.com/150x150.png?text=Info2",
//     description: "ข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูล",
//   },
//   {
//     id: 3,
//     image: "https://via.placeholder.com/150x150.png?text=Info3",
//     description: "ข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูล",
//   },
//   {
//     id: 4,
//     image: "https://via.placeholder.com/150x150.png?text=Info4",
//     description: "ข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูล",
//   },
//   {
//     id: 5,
//     image: "https://via.placeholder.com/150x150.png?text=Info5",
//     description: "ข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูล",
//   },
//   {
//     id: 6,
//     image: "https://via.placeholder.com/150x150.png?text=Info6",
//     description: "ข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูลข้อมูล",
//   },
// ];

// const InfographicNewsPage: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 flex flex-col items-center px-4 py-6">
//       {/* Header */}
//       <div className="flex items-center justify-between w-full max-w-7xl text-white mb-6">
//         <button onClick={() => navigate(-1)} className="text-xl hover:scale-110 transition">
//           {/* <FaArrowLeft /> */}
//           &larr;
//         </button>
//         <h1 className="text-xl font-bold text-center flex-1 -ml-6">ข่าวสาร</h1>
//         <div className="w-6" /> {/* เพื่อให้ปุ่มย้อนกลับไม่ดันหัวข้อ */}
//       </div>

//       {/* Content Box (ขยายเต็มจอด้านล่าง) */}
//       <div className="bg-white w-full max-w-7xl rounded-2xl shadow-lg p-6 flex flex-col flex-grow">
//         {/* Title + Filter Row */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <h2 className="text-lg font-semibold text-gray-800">อินโฟกราฟฟิก</h2>
//           <div className="flex flex-col sm:flex-row items-center gap-2">
//             <label className="text-sm font-medium text-gray-700">
//               เลือกกลุ่มโรคที่ต้องการ
//             </label>
//             <select className="rounded-md border border-gray-300 text-sm px-3 py-2 focus:ring focus:ring-blue-300">
//               <option>โรคไต</option>
//               <option>โรคเบาหวาน</option>
//               <option>โรคหัวใจ</option>
//             </select>
//           </div>
//         </div>

//         {/* Grid of Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {infographicData.map((item) => (
//             <div
//               key={item.id}
//               className="bg-white rounded-2xl shadow-md flex p-3 items-center"
//             >
//               {/* รูปภาพ */}
//               <img
//                 src={item.image}
//                 alt={`infographic-${item.id}`}
//                 className="w-24 h-24 object-cover rounded-xl mr-4"
//               />

//               {/* ข้อความ + ปุ่ม */}
//               <div className="flex flex-col flex-grow justify-between h-full">
//                 <p className="text-sm text-gray-700 mb-2 line-clamp-3">
//                   {item.description}
//                 </p>
//                 <button className="text-blue-500 text-sm self-start hover:underline">
//                   อ่านเพิ่มเติม
//                   {/* <FaArrowRight className="inline ml-1 text-xs" /> */}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InfographicNewsPage;
