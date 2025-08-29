// import React from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ZAxis,
    Cell,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from "recharts";
// import { useNavigate } from "react-router-dom";
// import { Leaf } from 'lucide-react';
const data = [
    { name: "บะหมี่กึ่งสำเร็จรูป", sodium: 1400 },
    { name: "บะหมี่น้ำหมูแดง", sodium: 1777 },
    { name: "ไส้กรอกคอคเทล", sodium: 1000 },
    { name: "ข้าวผัดหมู", sodium: 755 },
    { name: "ชีสบอร์เกอร์", sodium: 750 },
    { name: "เส้นเล็กน้ำหมู", sodium: 700 },
    { name: "ข้าวไข่ตุ๋น", sodium: 623 },
    { name: "พิซซ่าทะเล", sodium: 583 },
    { name: "ขนมอบกรอบ", sodium: 223 },
];

// ฟังก์ชันแปลง sodium → สี
const getColor = (sodium: number) => {
    if (sodium > 1200) return "#ef4444"; // แดงเข้ม
    if (sodium > 800) return "#f59e0b"; // เหลือง
    return "#10b981"; // เขียว
};

//   const navigate = useNavigate();

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-200">
                <p className="font-semibold text-gray-800 mb-1">{label}</p>
                <p className="text-sm">
                    <span className="text-blue-600">โซเดียม: </span>
                    <span className="font-bold">{payload[0]?.value} mg</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function SodiumCharts() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 font-kanit">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative px-6 py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">
                            การวิเคราะห์โซเดียมในอาหาร
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            เปรียบเทียบปริมาณโซเดียมในเมนูอาหารยอดนิยม เพื่อการเลือกรับประทานที่ดีต่อสุขภาพ
                        </p>
                    </div>
                </div>
            </div>
            

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                    {/* Bubble Chart */}
                    <div className="group">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    Bubble Chart
                                </h2>
                                <p className="text-pink-100 text-sm mt-1">ขนาดและสีของฟองแสดงระดับโซเดียม</p>
                            </div>
                            <div className="p-6">
                                <ResponsiveContainer width="100%" height={450}>
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                                        <XAxis
                                            type="category"
                                            dataKey="name"
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                            interval={0}
                                            angle={-35}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis
                                            type="number"
                                            dataKey="sodium"
                                            name="โซเดียม (mg)"
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                        />
                                        <ZAxis dataKey="sodium" range={[80, 500]} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Scatter data={data}>
                                            {data.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={getColor(entry.sodium)}
                                                    className="hover:opacity-80 transition-opacity" 
                                                />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Radar Chart */}
                    <div className="group">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    Radar Chart
                                </h2>
                                <p className="text-purple-100 text-sm mt-1">ระยะห่างจากจุดกลางแสดงปริมาณโซเดียม</p>
                            </div>
                            <div className="p-6">
                                <ResponsiveContainer width="100%" height={450}>
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis 
                                            dataKey="name" 
                                            tick={{ fontSize: 12, fill: '#6b7280' }} 
                                        />
                                        <PolarRadiusAxis 
                                            angle={30} 
                                            domain={[0, 1800]} 
                                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Radar
                                            name="Sodium"
                                            dataKey="sodium"
                                            stroke="#8b5cf6"
                                            fill="url(#radarGradient)"
                                            fillOpacity={0.4}
                                            strokeWidth={3}
                                        />
                                        <defs>
                                            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#8b5cf6" />
                                                <stop offset="100%" stopColor="#ec4899" />
                                            </linearGradient>
                                        </defs>
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend & Info Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Legend Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            ระดับโซเดียม
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg"></div>
                                <span className="text-sm font-medium text-gray-700">ต่ำ (≤800 mg)</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div className="w-4 h-4 rounded-full bg-amber-500 shadow-lg"></div>
                                <span className="text-sm font-medium text-gray-700">ปานกลาง (801-1200 mg)</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg"></div>
                                <span className="text-sm font-medium text-gray-700">สูง (≥1200 mg)</span>
                            </div>
                        </div>
                    </div>

                    {/* High Risk Foods */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                        <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                            <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            เมนูเสี่ยงสูง
                        </h3>
                        <div className="space-y-2">
                            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-red-100">
                                <div className="text-sm font-semibold text-red-800">บะหมี่น้ำหมูแดง</div>
                                <div className="text-xs text-red-600">1,777 mg โซเดียม</div>
                            </div>
                            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-red-100">
                                <div className="text-sm font-semibold text-red-800">บะหมี่กึ่งสำเร็จรูป</div>
                                <div className="text-xs text-red-600">1,400 mg โซเดียม</div>
                            </div>
                            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-red-100">
                                <div className="text-sm font-semibold text-red-800">ไส้กรอกคอคเทล</div>
                                <div className="text-xs text-red-600">1,000 mg โซเดียม</div>
                            </div>
                        </div>
                    </div>

                    {/* Health Tips */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                        <h3 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                            <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            คำแนะนำสุขภาพ
                        </h3>
                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-emerald-100">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                <span className="font-semibold text-emerald-700">แนะนำ:</span> บริโภคโซเดียมไม่เกิน 
                                <span className="font-bold text-emerald-800 mx-1">2,000 มก./วัน</span> 
                                เพื่อลดความเสี่ยงโรคความดันโลหิตสูงและโรคหัวใจ
                            </p>
                            <div className="mt-3 pt-3 border-t border-emerald-100">
                                <p className="text-xs text-emerald-600 font-medium">
                                    💡 เลือกเมนูที่มีโซเดียมต่ำและดื่มน้ำเปล่ามากๆ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}