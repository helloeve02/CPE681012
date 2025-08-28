// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const BMICalculatorFormPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     smoking: "",
//     drinking: "",
//     weight: "",
//     height: "",
//     waist: "",
//     systolic: "",
//     diastolic: "",
//     bloodSugar: "",
//     bloodSugarAfter: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleRadio = (name: string, value: string) => {
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = () => {
//     navigate("/assessment/bmiresult", { state: form });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 flex justify-center px-4 py-6">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="flex items-center text-white mb-6">
//           <button onClick={() => navigate(-1)} className="text-xl mr-2">
//             &larr;
//           </button>
//           <h1 className="text-lg font-bold">คำนวณดัชนีมวลกาย</h1>
//         </div>

//         {/* Content Box */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
//           <h2 className="text-sm font-bold text-gray-800">กรอกข้อมูลเพื่อคำนวณ</h2>

//           {/* Radio Section */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//             <div>
//               <p className="font-medium text-gray-700 mb-1">คุณสูบบุหรี่หรือไม่</p>
//               <div className="flex space-x-4">
//                 <label><input type="radio" name="smoking" onChange={() => handleRadio("smoking", "yes")} /> สูบ</label>
//                 <label><input type="radio" name="smoking" onChange={() => handleRadio("smoking", "no")} /> ไม่สูบ</label>
//               </div>
//             </div>
//             <div>
//               <p className="font-medium text-gray-700 mb-1">คุณดื่มสุราหรือไม่</p>
//               <div className="flex space-x-4">
//                 <label><input type="radio" name="drinking" onChange={() => handleRadio("drinking", "yes")} /> ดื่ม</label>
//                 <label><input type="radio" name="drinking" onChange={() => handleRadio("drinking", "no")} /> ไม่ดื่ม</label>
//               </div>
//             </div>
//           </div>

//           {/* Inputs: น้ำหนัก ส่วนสูง รอบเอว */}
//           <div className="space-y-4">
//             <input
//               name="weight"
//               type="number"
//               onChange={handleChange}
//               placeholder="น้ำหนัก (กก.)"
//               className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
//             />
//             <input
//               name="height"
//               type="number"
//               onChange={handleChange}
//               placeholder="ส่วนสูง (ซม.)"
//               className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
//             />
//             <input
//               name="waist"
//               type="number"
//               onChange={handleChange}
//               placeholder="รอบเอว วัดในระดับสะดือ (ซม.)"
//               className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
//             />
//           </div>

//           {/* ความดัน */}
//           <div>
//             <h2 className="text-sm font-bold text-gray-800 mb-2">ค่าความดัน</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <input
//                 name="systolic"
//                 type="number"
//                 onChange={handleChange}
//                 placeholder="ค่าความดันตัวบน"
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
//               />
//               <input
//                 name="diastolic"
//                 type="number"
//                 onChange={handleChange}
//                 placeholder="ค่าความดันตัวล่าง"
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
//               />
//             </div>
//           </div>

//           {/* น้ำตาลในเลือด */}
//           <div>
//             <h2 className="text-sm font-bold text-gray-800 mb-2">ระดับน้ำตาลในเลือด</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <input
//                 name="bloodSugar"
//                 type="number"
//                 onChange={handleChange}
//                 placeholder="น้ำตาลขณะอดอาหาร"
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
//               />
//               <input
//                 name="bloodSugarAfter"
//                 type="number"
//                 onChange={handleChange}
//                 placeholder="น้ำตาลหลังอาหาร 2 ชม."
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
//               />
//             </div>
//           </div>

//           {/* Button */}
//           <button
//             onClick={handleSubmit}
//             className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition"
//           >
//             คำนวณดัชนีมวลกาย
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BMICalculatorFormPage;
