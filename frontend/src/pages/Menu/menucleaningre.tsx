import React, { useState } from "react";
import { Beaker, Droplet, FlaskConical, FlaskRound, Sparkles, Leaf, Shield } from "lucide-react";

const METHODS = [
  {
    id: "baking-soda",
    name: "เบกกิ้งโซดา (ผงฟู)",
    icon: Beaker,
    range: { min: 80, max: 95 },
    color: "from-emerald-400 to-green-500",
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    textColor: "text-emerald-700 font-kanit",
    steps: [
      "ผสมเบกกิ้งโซดา 1 ช้อนโต๊ะ ต่อน้ำอุ่น 20 ลิตร",
      "แช่ผักไว้ 15 นาที",
      "ล้างออกด้วยน้ำสะอาด",
    ],
  },
  {
    id: "water",
    name: "น้ำเปล่า",
    icon: Droplet,
    range: { min: 54, max: 63 },
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
    textColor: "text-blue-700",
    steps: [
      "เด็ดผักเป็นใบ",
      "ล้างน้ำไหลผ่านให้สะอาด",
    ],
  },
  {
    id: "kmno4",
    name: "ด่างทับทิม",
    icon: FlaskConical,
    range: { min: 35, max: 43 },
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100",
    textColor: "text-purple-700",
    steps: [
      "ผสมด่างทับทิม 20–30 เกร็ด ต่อน้ำ 4 ลิตร",
      "แช่ผักไว้ 10 นาที",
      "ล้างออกด้วยน้ำสะอาด",
    ],
  },
  {
    id: "vinegar",
    name: "น้ำส้มสายชู",
    icon: FlaskRound,
    range: { min: 29, max: 38 },
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-100",
    textColor: "text-amber-700",
    steps: [
      "ผสมน้ำส้มสายชู 1 ช้อนโต๊ะ ต่อน้ำ 4 ลิตร",
      "แช่ผักไว้ 10 นาที",
      "ล้างออกด้วยน้ำสะอาด",
    ],
  },
  {
    id: "salt",
    name: "เกลือป่น",
    icon: Sparkles,
    range: { min: 27, max: 38 },
    color: "from-slate-400 to-gray-500",
    bgColor: "bg-slate-50",
    iconBg: "bg-slate-100",
    textColor: "text-slate-700",
    steps: [
      "ผสมเกลือป่น 1 ช้อนโต๊ะ ต่อน้ำ 4 ลิตร",
      "แช่ผักไว้ 10 นาที",
      "ล้างออกด้วยน้ำสะอาด",
    ],
  },
];

function RangeBar({ min, max, color }: { min: number; max: number; color: string }) {
  const avg = (min + max) / 2;
  const effectiveness = avg >= 70 ? "ดีเยี่ยม" : avg >= 45 ? "ดี" : "ปานกลาง";

  return (
    <div className="w-full ">
      <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-gray-100 to-gray-200 shadow-inner font-kanit">
        <div
          className={`absolute h-4 rounded-full bg-gradient-to-r ${color} shadow-sm transition-all duration-500 ease-out`}
          style={{ left: `${min}%`, width: `${Math.max(max - min, 3)}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">{min}%</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-800">{min}–{max}%</span>
          <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-600 shadow-sm">
            {effectiveness}
          </span>
        </div>
        <span className="text-xs text-gray-500">{max}%</span>
      </div>
    </div>
  );
}

function MethodCard({ method, isHovered, onHover }: { method: any; isHovered: boolean; onHover: (id: string | null) => void }) {
  const { name, icon: Icon, steps, range, color, bgColor, iconBg, textColor } = method;
  
  return (
    <div 
      className={`font-kanit group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isHovered ? 'ring-2 ring-blue-200' : ''}`}
      onMouseEnter={() => onHover(method.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={`absolute inset-0 ${bgColor} opacity-20 transition-opacity duration-300 ${isHovered ? 'opacity-30' : ''}`} />
      
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`h-7 w-7 ${textColor}`} />
          </div>
          <h3 className="text-xl font-bold leading-tight text-gray-900">{name}</h3>
        </div>

        <div className="mb-6 space-y-3">
          {steps.map((step: string, i: number) => (
            <div key={i} className="flex gap-3 items-start">
              <span className={`mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gradient-to-r ${color} text-xs font-bold text-white shadow-sm`}>
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-gray-700">{step}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-600" />
            <p className="text-sm font-semibold text-gray-800">ประสิทธิภาพในการลดสารตกค้าง</p>
          </div>
          <RangeBar min={range.min} max={range.max} color={color} />
        </div>
      </div>
    </div>
  );
}

export default function CleaningMethodCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 font-kanit">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm mb-4">
            <Leaf className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">คู่มือล้างผักผลไม้</span>
          </div>
          
          <h1 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            วิธีล้างผัก/ผลไม้<br />เพื่อลดสารตกค้าง
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-gray-600 leading-relaxed">
            เปรียบเทียบประสิทธิภาพและขั้นตอนการล้างผักผลไม้แบบง่ายๆ 
            เพื่อลดสารเคมีตกค้างได้อย่างมีประสิทธิภาพ
          </p>
          
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-6 rounded-full bg-white px-6 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
                <span className="text-xs font-medium text-gray-700">ดีเยี่ยม (70%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"></div>
                <span className="text-xs font-medium text-gray-700">ดี (45-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-slate-400 to-gray-500"></div>
                <span className="text-xs font-medium text-gray-700">ปานกลาง (&lt;45%)</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {METHODS.map((method) => (
            <MethodCard 
              key={method.id} 
              method={method} 
              isHovered={hoveredCard === method.id}
              onHover={setHoveredCard}
            />
          ))}
        </div>
        
        <footer className="mt-16 text-center">
          <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 p-6 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">คำแนะนำ</h3>
            </div>
            <p className="text-sm text-gray-700 max-w-2xl mx-auto leading-relaxed">
              แนะนำให้ใช้เบกกิ้งโซดาสำหรับประสิทธิภาพสูงสุด หรือน้ำเปล่าสำหรับวิธีง่ายๆ ประจำวัน 
              อย่าลืมล้างน้ำสะอาดทุกครั้งหลังจากใช้สารล้าง
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}