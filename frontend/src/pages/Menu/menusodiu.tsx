import React from "react";
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

const data = [
    { name: "บะหมี่กึ่งสำเร็จรูป", sodium: 1400 },
    { name: "บะหมี่น้ำหมูแดง", sodium: 1777 },
    { name: "ไส้กรอกทอดพอด", sodium: 1000 },
    { name: "ข้าวผัดหมู", sodium: 755 },
    { name: "ชีสบอร์เกอร์", sodium: 750 },
    { name: "เส้นเล็กน้ำหมู", sodium: 700 },
    { name: "ข้าวไข่ตุ๋น", sodium: 623 },
    { name: "พิซซ่าทะเล", sodium: 583 },
    { name: "ขนมอบกรอบ", sodium: 223 },
];

// ฟังก์ชันแปลง sodium → สี
const getColor = (sodium: number) => {
    if (sodium > 1200) return "#dc2626"; // แดงเข้ม
    if (sodium > 800) return "#f59e0b"; // เหลือง
    return "#16a34a"; // เขียว
};

export default function SodiumCharts() {
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-slate-50 p-6 font-kanit">
            <h1 className="text-xl font-bold text-center mb-8 text-gray-900">
                การเปรียบเทียบโซเดียมในเมนูอาหาร
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bubble Chart */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <h2 className="text-lg font-semibold text-center mb-4 text-gray-700">
                        Bubble Chart (โซเดียมสูง = Bubble ใหญ่ สีแดง)
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                            <XAxis
                                type="category"
                                dataKey="name"
                                tick={{ fontSize: 11 }}
                                interval={0}
                                angle={-30}
                                textAnchor="end"
                            />
                            <YAxis
                                type="number"
                                dataKey="sodium"
                                name="โซเดียม (mg)"
                                tick={{ fontSize: 12 }}
                            />
                            <ZAxis dataKey="sodium" range={[60, 400]} />
                            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                            <Scatter data={data}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColor(entry.sodium)} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {/* Radar Chart */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <h2 className="text-lg font-semibold text-center mb-4 text-gray-700">
                        Radar Chart (เมนูที่ยื่นออกไปไกล = โซเดียมสูง)
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 1800]} />
                            <Tooltip />
                            <Radar
                                name="Sodium"
                                dataKey="sodium"
                                stroke="#dc2626"
                                fill="#dc2626"
                                fillOpacity={0.5}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="mt-8 space-y-6">
                {/* Legend */}
                <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-green-600"></span>
                        <span className="text-sm text-gray-700">โซเดียมต่ำ</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
                        <span className="text-sm text-gray-700">ปานกลาง</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-red-600"></span>
                        <span className="text-sm text-gray-700">สูง (อันตราย)</span>
                    </div>
                </div>

                {/* Top Risk Foods */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="font-bold text-red-700 mb-2">⚠️ เมนูโซเดียมสูงที่สุด</h3>
                    <ul className="list-disc list-inside text-sm text-red-600">
                        <li>บะหมี่น้ำหมูแดง — 1,777 mg</li>
                        <li>บะหมี่กึ่งสำเร็จรูป — 1,400 mg</li>
                        <li>ไส้กรอกทอดพอด — 1,000 mg</li>
                    </ul>
                </div>

                {/* Health Tips */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-bold text-green-700 mb-2">💡 เคล็ดลับสุขภาพ</h3>
                    <p className="text-sm text-gray-700">
                        แนะนำให้บริโภคโซเดียมไม่เกิน
                        <span className="font-semibold text-green-700"> 2,000 มิลลิกรัมต่อวัน </span>
                        เพื่อลดความเสี่ยงต่อโรคความดันโลหิตสูง และโรคหัวใจ
                    </p>
                </div>
            </div>

        </div>
    );
}
