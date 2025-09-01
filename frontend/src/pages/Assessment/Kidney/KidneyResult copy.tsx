// import React, { useState, useEffect } from "react";
// import {
//   ArrowLeft,
//   Info,
//   RefreshCw,
//   CheckCircle,
//   AlertTriangle,
//   XCircle,
//   TrendingUp,
//   Heart,
//   Shield,
//   Activity,
//   User,
//   Ruler,
//   Droplets
// } from "lucide-react";
// import { useLocation } from 'react-router-dom';
// interface FormData {
//   age: string;
//   gender: string;
//   waist: string;
//   diabetes: string;
//   bp: string;
// }

// interface Props {
//   formData?: FormData;
//   onBack?: () => void;
//   onReset?: () => void;
// }

// const KidneyRiskResultsPage: React.FC<Props> = ({
//   formData: propFormData,
//   onBack,
//   onReset
// }) => {
//   // รับข้อมูลจาก props หรือ localStorage หรือ state
//   const location = useLocation() as any;
// const stateFormData = location.state as FormData | null;
// console.log(stateFormData)

// useEffect(() => {
//   if (stateFormData) setFormData(stateFormData);
//   setLoading(false);
// }, [stateFormData]);

//   // const [formData, setFormData] = useState<FormData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState<FormData>({
//   age: "",
//   gender: "",
//   waist: "",
//   diabetes: "",
//   bp: ""
// });
//   // const { formData: stateFormData, score } = location.state || {};
//   useEffect(() => {
//   let data: FormData | null = null;
//   console.log(data)
//   if (propFormData) {
//     data = propFormData;
//   } else if (formData) {
//     data = formData;
//   } else if (typeof window !== "undefined") {
//     const urlParams = new URLSearchParams(window.location.search);
//     if (urlParams.has("age") && urlParams.has("gender")) {
//       data = {
//         age: urlParams.get("age") || "0",
//         gender: urlParams.get("gender") || "0",
//         waist: urlParams.get("waist") || "0",
//         diabetes: urlParams.get("diabetes") || "0",
//         bp: urlParams.get("bp") || "0"
//       };
//     }
//   }

//   if (data) {
//     setFormData(data);
//   }

//   setLoading(false);

//   const handleAssessmentComplete = (event: any) => {
//     const { formData: eventData } = event.detail;
//     setFormData(eventData);
//   };

//   window.addEventListener("kidneyAssessmentComplete", handleAssessmentComplete);
//   return () => {
//     window.removeEventListener("kidneyAssessmentComplete", handleAssessmentComplete);
//   };
// }, [propFormData, setFormData]);

//   // คำนวณคะแนนจากข้อมูลที่ได้รับ
//   const calculateScore = (data: FormData): number => {
//     let score = 0;
//     if (data.age) score += parseInt(data.age);
//     if (data.gender) score += parseInt(data.gender);
//     if (data.waist) score += parseInt(data.waist);
//     if (data.diabetes) score += parseInt(data.diabetes);
//     if (data.bp) score += parseInt(data.bp);
//     return score;
//   };

//   const getAssessmentResult = (data: FormData) => {
//     const score = calculateScore(data);
//     let level = "";
//     let color = "";
//     let description = "";
//     let icon = CheckCircle;

//     if (score >= -2 && score <= 2) {
//       level = "ระดับน้อย";
//       color = "from-green-500 to-emerald-600";
//       description = "มีความเสี่ยงน้อยกว่า 5%";
//       icon = CheckCircle;
//     } else if (score >= 3 && score <= 6) {
//       level = "ระดับปานกลาง";
//       color = "from-yellow-500 to-amber-600";
//       description = "มีความเสี่ยง 5-10%";
//       icon = Shield;
//     } else if (score >= 7 && score <= 9) {
//       level = "ระดับสูง";
//       color = "from-orange-500 to-red-500";
//       description = "มีความเสี่ยง 10-20%";
//       icon = AlertTriangle;
//     } else {
//       level = "ระดับรุนแรง";
//       color = "from-red-500 to-red-600";
//       description = "มีความเสี่ยง 20% ขึ้นไป";
//       icon = XCircle;
//     }

//     return { score, level, color, description, icon };
//   };

//   const riskLevels = [
//     {
//       score: "-2 ถึง 2",
//       level: "ระดับน้อย",
//       risk: "มีความเสี่ยงน้อยกว่า 5%",
//       color: "from-green-500 to-emerald-600",
//       icon: CheckCircle,
//       bgColor: "bg-green-50",
//       textColor: "text-green-600"
//     },
//     {
//       score: "3 ถึง 6",
//       level: "ระดับปานกลาง",
//       risk: "มีความเสี่ยง 5-10%",
//       color: "from-yellow-500 to-amber-600",
//       icon: Shield,
//       bgColor: "bg-yellow-50",
//       textColor: "text-yellow-600"
//     },
//     {
//       score: "7 ถึง 9",
//       level: "ระดับสูง",
//       risk: "มีความเสี่ยง 10-20%",
//       color: "from-orange-500 to-red-500",
//       icon: AlertTriangle,
//       bgColor: "bg-orange-50",
//       textColor: "text-orange-600"
//     },
//     {
//       score: "10 ขึ้นไป",
//       level: "ระดับรุนแรง",
//       risk: "มีความเสี่ยง 20% ขึ้นไป",
//       color: "from-red-500 to-red-600",
//       icon: XCircle,
//       bgColor: "bg-red-50",
//       textColor: "text-red-600"
//     }
//   ];

//   // ฟังก์ชันแปลค่าเป็นข้อความ
//  const getAgeText = (value: string | number) => {
//   console.log(value)
//   switch (Number(value)) {
//     case 0: return "น้อยกว่า 45 ปี";
//     case 2: return "45-54 ปี";
//     case 4: return "มากกว่า 55 ปี";
//     default: return "ไม่ระบุ";
//   }
// };


//   const getGenderText = (value: string) => {
//     console.log(value)
//     switch (value) {
//       case "0": return "หญิง";
//       case "3": return "ชาย";
//       default: return "ไม่ระบุ";
//     }
//   };

//   const getWaistText = (value: string, gender: string) => {
//     if (gender === "0") { // หญิง
//       return value === "0" ? "น้อยกว่า 80 เซนติเมตร" : "มากกว่า 80 เซนติเมตร";
//     } else { // ชาย
//       return value === "0" ? "น้อยกว่า 90 เซนติเมตร" : "มากกว่า 90 เซนติเมตร";
//     }
//   };

//   const getDiabetesText = (value: string) => {
//     return value === "2" ? "มี" : "ไม่มี";
//   };

//   const getBpText = (value: string) => {
//     switch (value) {
//       case "-2": return "น้อยกว่า 120 มิลลิเมตรปรอท";
//       case "0": return "120-129 มิลลิเมตรปรอท";
//       case "1": return "130-139 มิลลิเมตรปรอท";
//       case "2": return "140-149 มิลลิเมตรปรอท";
//       case "3": return "150-159 มิลลิเมตรปรอท";
//       case "4": return "เท่ากับหรือมากกว่า 160 มิลลิเมตรปรอท";
//       default: return "ไม่ระบุ";
//     }
//   };

//   // หาระดับความเสี่ยงปัจจุบัน
//   const getCurrentRiskLevel = (assessmentResult: any) => {
//     if (assessmentResult.score >= -2 && assessmentResult.score <= 2) return riskLevels[0];
//     if (assessmentResult.score >= 3 && assessmentResult.score <= 6) return riskLevels[1];
//     if (assessmentResult.score >= 7 && assessmentResult.score <= 9) return riskLevels[2];
//     return riskLevels[3];
//   };

//   const handleBack = () => {
//     if (onBack) {
//       onBack();
//     } else if (typeof window !== 'undefined' && window.history.length > 1) {
//       window.history.back();
//     }
//   };

//   const handleReset = () => {
//     if (onReset) {
//       onReset();
//     } else {
//       handleBack();
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">กำลังโหลดผลการประเมิน...</p>
//         </div>
//       </div>
//     );
//   }

//   // ถ้าไม่มีข้อมูล ให้ใช้ข้อมูลเริ่มต้น
 

//   const assessmentResult = getAssessmentResult(formData);
//   const currentRisk = getCurrentRiskLevel(assessmentResult);

//   const resultSections = [
//     {
//       title: "ผลคะแนนรวม",
//       icon: TrendingUp,
//       color: currentRisk.color,
//       content: (
//         <div className="text-center space-y-4">
//           <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
//             <p className="text-white/90 text-lg mb-2">คะแนนรวมของคุณ</p>
//             <p className="text-5xl font-bold text-white mb-2">{assessmentResult.score}</p>
//             <p className="text-white/90 text-sm">คะแนน</p>
//           </div>
//         </div>
//       )
//     },
//     {
//       title: "ระดับความเสี่ยง",
//       icon: currentRisk.icon,
//       color: currentRisk.color,
//       content: (
//         <div className="text-center space-y-4">
//           <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
//             <h3 className="text-2xl font-bold text-white mb-2">{currentRisk.level}</h3>
//             <p className="text-white/90 text-lg">{currentRisk.risk}</p>
//           </div>
//         </div>
//       )
//     },
//     {
//       title: "ข้อมูลที่ใช้ประเมิน",
//       icon: User,
//       color: "from-indigo-500 to-purple-600",
//       content: (
//         <div className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-gray-50 rounded-xl p-4">
//               <div className="flex items-center gap-3 mb-2">
//                 <User size={20} className="text-blue-600" />
//                 <span className="font-semibold text-gray-700">ข้อมูลทั่วไป</span>
//               </div>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">อายุ:</span>
//                   <span className="font-medium">{getAgeText(formData?.age)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">เพศ:</span>
//                   <span className="font-medium">{getGenderText(formData.gender)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-4">
//               <div className="flex items-center gap-3 mb-2">
//                 <Ruler size={20} className="text-purple-600" />
//                 <span className="font-semibold text-gray-700">การวัดร่างกาย</span>
//               </div>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">รอบเอว:</span>
//                   <span className="font-medium">{getWaistText(formData.waist, formData.gender)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-4">
//               <div className="flex items-center gap-3 mb-2">
//                 <Droplets size={20} className="text-green-600" />
//                 <span className="font-semibold text-gray-700">ประวัติสุขภาพ</span>
//               </div>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">โรคเบาหวาน:</span>
//                   <span className="font-medium">{getDiabetesText(formData.diabetes)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-4">
//               <div className="flex items-center gap-3 mb-2">
//                 <Heart size={20} className="text-red-600" />
//                 <span className="font-semibold text-gray-700">ความดันโลหิต</span>
//               </div>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">ระดับซิสโตลิก:</span>
//                   <span className="font-medium">{getBpText(formData.bp)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="relative max-w-7xl mx-auto px-6 py-12">
//           {/* Header Navigation */}
//           <div className="flex items-center mb-8">
//             <button
//               onClick={handleBack}
//               className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
//             >
//               <ArrowLeft size={22} />
//             </button>
//             <h1 className="flex-1 text-center text-white font-bold text-xl tracking-wide">
//               โรคไต
//             </h1>
//             <div className="w-12" />
//           </div>

//           {/* Hero Content */}
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 border border-white/20">
//               <span className="text-4xl">🫘</span>
//             </div>
//             <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
//               ผลการประเมิน
//             </h2>
//             <p className="text-xl text-cyan-100 max-w-2xl mx-auto leading-relaxed">
//               ความเสี่ยงโรคไตใน 10 ปีข้างหน้า
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

//       <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
//         {/* Instructions Card */}
//         <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
//           <div className="flex items-start gap-4">
//             <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex-shrink-0">
//               <Info className="text-white" size={24} />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold mb-2">ผลการประเมินความเสี่ยง</h3>
//               <p className="text-purple-100 leading-relaxed">
//                 นี่คือผลการประเมินความเสี่ยงโรคไตของคุณ โปรดศึกษาข้อมูลและคำแนะนำเพื่อการดูแลสุขภาพที่ดีขึ้น
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Results Sections */}
//         <div className="space-y-8 mb-8">
//           {resultSections.map((section, sectionIdx) => {
//             const SectionIcon = section.icon;
//             return (
//               <div key={sectionIdx} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//                 {/* Section Header */}
//                 <div className={`bg-gradient-to-r ${section.color} p-6`}>
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
//                       <SectionIcon className="text-white" size={24} />
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold text-white mb-1">{section.title}</h3>
//                       <p className="text-white/80 text-sm">
//                         ผลลัพธ์จากการประเมิน
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Section Content */}
//                 <div className="p-6">
//                   {section.content}
//                 </div>
//               </div>
//             );
//           })}

//           {/* Risk Level Comparison Section */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
//                   <Activity className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold text-white mb-1">แปลผลระดับความเสี่ยง</h3>
//                   <p className="text-white/80 text-sm">
//                     ตารางเปรียบเทียบระดับความเสี่ยงต่างๆ
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {riskLevels.map((level, index) => {
//                   const LevelIcon = level.icon;
//                   const isCurrentLevel =
//                     (assessmentResult.score >= -2 && assessmentResult.score <= 2 && level.score === "-2 ถึง 2") ||
//                     (assessmentResult.score >= 3 && assessmentResult.score <= 6 && level.score === "3 ถึง 6") ||
//                     (assessmentResult.score >= 7 && assessmentResult.score <= 9 && level.score === "7 ถึง 9") ||
//                     (assessmentResult.score >= 10 && level.score === "10 ขึ้นไป");

//                   return (
//                     <div
//                       key={index}
//                       className={`p-4 rounded-xl border-2 transition-all ${isCurrentLevel
//                           ? `${level.bgColor} border-current ${level.textColor} shadow-lg scale-105`
//                           : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//                         }`}
//                     >
//                       <div className="flex items-center gap-3 mb-3">
//                         <div className={`p-2 rounded-lg ${isCurrentLevel ? 'bg-white/50' : 'bg-gray-200'}`}>
//                           <LevelIcon size={20} className={isCurrentLevel ? level.textColor : 'text-gray-600'} />
//                         </div>
//                         <div>
//                           <h4 className={`font-bold ${isCurrentLevel ? level.textColor : 'text-gray-700'}`}>
//                             {level.level}
//                           </h4>
//                           <p className={`text-sm ${isCurrentLevel ? level.textColor : 'text-gray-500'}`}>
//                             คะแนน: {level.score}
//                           </p>
//                         </div>
//                       </div>
//                       <p className={`text-sm ${isCurrentLevel ? level.textColor : 'text-gray-600'}`}>
//                         {level.risk}
//                       </p>
//                       {isCurrentLevel && (
//                         <div className="mt-2 flex items-center gap-1">
//                           <CheckCircle size={16} className={level.textColor} />
//                           <span className={`text-xs font-bold ${level.textColor}`}>ระดับของคุณ</span>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Action Section */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
//                   <RefreshCw className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold text-white mb-1">การดำเนินการต่อไป</h3>
//                   <p className="text-white/80 text-sm">
//                     เลือกการดำเนินการที่เหมาะสม
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={handleReset}
//                   className="flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
//                 >
//                   <RefreshCw size={20} />
//                   ประเมินใหม่
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Medical Advice Card */}
//         <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white mb-12">
//           <div className="flex items-start gap-4">
//             <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex-shrink-0">
//               <Info className="text-white" size={24} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold mb-3">ข้อมูลสำคัญ</h3>
//               <p className="text-amber-100 leading-relaxed mb-3">
//                 การประเมินนี้เป็นเพียงแนวทางเบื้องต้น <span className="font-bold text-white">ไม่ใช่การวินิจฉัยทางการแพทย์</span>
//               </p>
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-amber-100">
//                   <span className="w-2 h-2 bg-white/60 rounded-full"></span>
//                   <span>หากมีความเสี่ยงสูง ควรปรึกษาแพทย์เพื่อการตรวจวินิจฉัยที่แม่นยำ</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-amber-100">
//                   <span className="w-2 h-2 bg-white/60 rounded-full"></span>
//                   <span>การดูแลสุขภาพอย่างสม่ำเสมอช่วยลดความเสี่ยงได้</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-amber-100">
//                   <span className="w-2 h-2 bg-white/60 rounded-full"></span>
//                   <span>ควรตรวจสุขภาพประจำปีเพื่อติดตามผลต่อเนื่อง</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KidneyRiskResultsPage;