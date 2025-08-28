// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const BMICalculatorResultPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const {
//     weight,
//     height,
//     waist,
//     systolic,
//     diastolic,
//     bloodSugar,
//     bloodSugarAfter,
//     smoking,
//     drinking,
//   } = state || {};

//   const heightM = height / 100;
//   const bmi = (weight / (heightM * heightM)).toFixed(1);

//   const getBMICategory = (bmi: number) => {
//     if (bmi < 18.5) return "ต่ำกว่าเกณฑ์";
//     if (bmi < 23) return "ปกติ";
//     if (bmi < 25) return "น้ำหนักเกิน";
//     if (bmi < 30) return "โรคอ้วน";
//     return "โรคอ้วนรุนแรง";
//   };

//   const getAdviceFromBMI = (bmi: number): string => {
//   if (bmi < 18.5) return "คุณมีน้ำหนักต่ำกว่าเกณฑ์ ควรรับประทานอาหารให้ครบ 5 หมู่ และตรวจสุขภาพสม่ำเสมอ";
//   if (bmi < 23) return "คุณมีน้ำหนักอยู่ในเกณฑ์ปกติ ควรรักษาไว้ด้วยการออกกำลังกายและรับประทานอาหารอย่างเหมาะสม";
//   if (bmi < 25) return "คุณมีน้ำหนักเกิน ควรเริ่มควบคุมอาหารและเพิ่มการออกกำลังกาย";
//   if (bmi < 30) return "คุณอยู่ในภาวะโรคอ้วน ควรควบคุมอาหาร ออกกำลังกาย และปรึกษาแพทย์";
//   return "คุณอยู่ในภาวะโรคอ้วนรุนแรง ควรพบแพทย์เพื่อขอคำปรึกษาโดยเร็ว";
// };


//   const bmiCategory = getBMICategory(Number(bmi));
//   const advice = getAdviceFromBMI(Number(bmi));


//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 px-4 py-6 flex flex-col items-center">
//       {/* Header */}
//       <div className="flex items-center justify-between w-full max-w-md text-white mb-5">
//         <button onClick={() => navigate(-1)} className="text-xl hover:scale-110 transition">
//           &larr;
//         </button>
//         <h1 className="text-lg font-bold text-center flex-1 -ml-6">คำนวณดัชนีมวลกาย</h1>
//         <div className="w-6" />
//       </div>

//       {/* Result Card */}
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-6">
//         {/* Illustration & BMI bar */}
//         <div className="flex flex-col items-center space-y-3">
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/2965/2965567.png"
//             alt="Yoga Pose"
//             className="w-24 h-24"
//           />

//           {/* BMI Meter */}
//           <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
//             <div
//               className={`h-4 rounded-full transition-all duration-300 ${
//                 bmi < 18.5
//                   ? "bg-blue-500 w-[20%]"
//                   : bmi < 23
//                   ? "bg-green-500 w-[40%]"
//                   : bmi < 25
//                   ? "bg-yellow-400 w-[60%]"
//                   : bmi < 30
//                   ? "bg-orange-400 w-[80%]"
//                   : "bg-red-500 w-full"
//               }`}
//             />
//           </div>

//           <div className="flex justify-between text-xs text-gray-600 w-full">
//             <span>ต่ำกว่าเกณฑ์</span>
//             <span>ปกติ</span>
//             <span>น้ำหนักเกิน</span>
//             <span>โรคอ้วน</span>
//             <span>รุนแรง</span>
//           </div>
//         </div>

//         {/* Info Summary */}
//         <div className="bg-gray-100 p-4 rounded-xl space-y-2 text-sm text-gray-700">
//           <div className="grid grid-cols-2 gap-x-4 gap-y-2">
//             <p>น้ำหนัก: {weight} กก.</p>
//             <p>ส่วนสูง: {height} ซม.</p>
//             <p>รอบเอว: {waist} ซม.</p>
//             <p>ความดันโลหิต: {systolic}/{diastolic}</p>
//             <p>น้ำตาลในเลือด: {bloodSugar} mg/dL</p>
//             <p>น้ำตาลหลังอาหาร: {bloodSugarAfter} mg/dL</p>
//             <p>สูบบุหรี่: {smoking === "yes" ? "สูบ" : "ไม่สูบ"}</p>
//             <p>ดื่มสุรา: {drinking === "yes" ? "ดื่ม" : "ไม่ดื่ม"}</p>
//           </div>
//           <div className="border-t pt-2 font-medium text-gray-800">
//             ค่า BMI: {bmi} <span className="text-blue-600">({bmiCategory})</span>
//           </div>
//         </div>

//         <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
//   <p className="text-sm font-semibold">คำแนะนำ:</p>
//   <p className="text-sm">{advice}</p>
// </div>

//         {/* Button */}
//         <button
//           onClick={() => navigate("/assessment/bmi")}
//           className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition"
//         >
//           กลับ
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BMICalculatorResultPage;
