// // import React from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   ArrowLeft, 
//   Users, 
//   User, 
//   Calendar,
//   ChevronRight,
//   Info,
//   Activity
// } from "lucide-react";

// const SelectAgeRange: React.FC = () => {
//   const navigate = useNavigate();

//   const ageGroups = [
//     {
//       title: "ฉันอายุมากกว่า 35 ปีขึ้นไป",
//       subtitle: "กลุ่มเสี่ยงสูง - ควรประเมินอย่างละเอียด",
//       icon: Users,
//       color: "from-red-500 to-red-600",
//       bgColor: "bg-red-50",
//       textColor: "text-red-700",
//       path: "/assessment/diabetesmoreassessmentpage",
//       description: "ความเสี่ยงเพิ่มขึ้นตามอายุ"
//     },
//     {
//       title: "ฉันอายุระหว่าง 15 - 34 ปี",
//       subtitle: "กลุ่มวัยหนุ่มสาว - ประเมินพื้นฐาน",
//       icon: User,
//       color: "from-blue-500 to-blue-600",
//       bgColor: "bg-blue-50",
//       textColor: "text-blue-700",
//       path: "/assessment/diabeteslessassessmentpage",
//       description: "การประเมินเบื้องต้น"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="relative max-w-7xl mx-auto px-6 py-12">
//           {/* Header Navigation */}
//           <div className="flex items-center mb-8">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
//             >
//               <ArrowLeft size={22} />
//             </button>
//             <h1 className="flex-1 text-center text-white font-bold text-xl tracking-wide">
//               โรคเบาหวาน
//             </h1>
//             <div className="w-12" />
//           </div>

//           {/* Hero Content */}
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 border border-white/20">
//               <span className="text-4xl">🩺</span>
//             </div>
//             <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
//               ประเมินความเสี่ยง
//             </h2>
//             <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
//               เลือกช่วงอายุของคุณเพื่อเริ่มการประเมินความเสี่ยงโรคเบาหวาน
//             </p>
//           </div>
//         </div>

//         {/* Wave Bottom */}
//         <div className="absolute bottom-0 left-0 right-0">
//           <svg className="w-full h-12 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
//             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
//           </svg>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
//         {/* Age Selection Section */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-4">
//               <Calendar size={16} />
//               <span>เลือกช่วงอายุ</span>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">คุณอายุเท่าไหร่?</h3>
//             <p className="text-gray-600">การประเมินความเสี่ยงจะแตกต่างกันตามช่วงอายุ เลือกช่วงอายุที่ตรงกับคุณ</p>
//           </div>

//           <div className="p-6">
//             <div className="space-y-4">
//               {ageGroups.map((group, index) => {
//                 const Icon = group.icon;
//                 return (
//                   <button
//                     key={index}
//                     onClick={() => navigate(group.path)}
//                     className="group w-full bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl text-left"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className={`p-4 bg-gradient-to-r ${group.color} rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}>
//                         <Icon size={28} />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-gray-900">
//                           {group.title}
//                         </h4>
//                         <p className="text-sm text-gray-600 mb-2">
//                           {group.subtitle}
//                         </p>
//                         <div className={`inline-flex items-center gap-1 px-3 py-1 ${group.bgColor} ${group.textColor} rounded-full text-xs font-medium`}>
//                           <Activity size={12} />
//                           <span>{group.description}</span>
//                         </div>
//                       </div>
//                       <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
//                         <ChevronRight size={24} />
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Important Information */}
//         <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-12">
//           <div className="flex items-start gap-4">
//             <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex-shrink-0">
//               <Info className="text-white" size={24} />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold mb-2">ข้อมูลสำคัญ</h3>
//               <p className="text-amber-100 leading-relaxed mb-3">
//                 การประเมินนี้เหมาะสำหรับผู้ที่มีอายุ <span className="font-bold text-white">15 ปีขึ้นไป</span> เท่านั้น
//               </p>
//               <div className="flex items-center gap-2 text-sm text-amber-100">
//                 <span className="w-2 h-2 bg-white/60 rounded-full"></span>
//                 <span>หากอายุต่ำกว่า 15 ปี ควรปรึกษาแพทย์โดยตรง</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Statistics Card */}
//         {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
//               <span className="text-white text-2xl">📊</span>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-3">ทำไมต้องประเมินตามอายุ?</h3>
//             <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
//               ความเสี่ยงโรคเบาหวานเพิ่มขึ้นตามอายุ โดยเฉพาะหลังอายุ 35 ปี 
//               การประเมินที่เหมาะสมจะช่วยให้ได้ผลลัพธ์ที่แม่นยำมากขึ้น
//             </p>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
//               <div className="bg-blue-50 rounded-xl p-4">
//                 <div className="text-2xl font-bold text-blue-600 mb-1">15-34 ปี</div>
//                 <div className="text-sm text-blue-700">ประเมินพื้นฐาน</div>
//               </div>
//               <div className="bg-red-50 rounded-xl p-4">
//                 <div className="text-2xl font-bold text-red-600 mb-1">35+ ปี</div>
//                 <div className="text-sm text-red-700">ประเมินเข้มข้น</div>
//               </div>
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default SelectAgeRange;