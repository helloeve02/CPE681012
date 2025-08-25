import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Plus, Trash2, Info, ChevronRight, Target, TrendingUp, AlertTriangle, CheckCircle, Calendar, Clock } from "lucide-react";

// --- Data (รวมทั้งสองตาราง) ---
const ITEMS = [
  { id: "salt", name: "เกลือ", unit: "ช้อนชา", mgPerUnit: 2000 },
  { id: "soup_cube", name: "ซุปก้อน", unit: "ก้อน", mgPerUnit: 1760 },
  { id: "seasoning_powder", name: "ผงปรุงรส", unit: "ช้อนชา", mgPerUnit: 950 },
  { id: "tai-pla", name: "ไตปลา (ปลาทู)", unit: "ช้อนชา", mgPerUnit: 750 },
  { id: "fish_sauce", name: "น้ำปลา", unit: "ช้อนชา", mgPerUnit: 705 },
  { id: "msg", name: "ผงชูรส", unit: "ช้อนชา", mgPerUnit: 600 },
  { id: "shrimp_paste", name: "กะปิ", unit: "ช้อนชา", mgPerUnit: 500 },
  { id: "fish_sauce2", name: "น้ำปลา", unit: "ช้อนชา", mgPerUnit: 400 },
  { id: "soy_sauce_light", name: "ซีอิ๊วขาว", unit: "ช้อนชา", mgPerUnit: 400 },
  { id: "seasoning_sauce", name: "ซอสปรุงรส", unit: "ช้อนชา", mgPerUnit: 400 },
  { id: "fermented_fish_sauce", name: "ผงฟู", unit: "ช้อนชา", mgPerUnit: 340 },
  { id: "oyster_sauce", name: "น้ำบูดู", unit: "ช้อนชา", mgPerUnit: 260 },
  { id: "dark_soy_sauce", name: "เต้าเจี้ยว", unit: "ช้อนชา", mgPerUnit: 213 },
  { id: "fish_sauce_raw", name: "น้ำปลาร้า", unit: "ช้อนชา", mgPerUnit: 158 },
  { id: "mixed_sauce", name: "ซอสหอยนางรม", unit: "ช้อนชา", mgPerUnit: 150 },
  { id: "chili_paste", name: "น้ำพริกเผา", unit: "ช้อนชา", mgPerUnit: 137 },
  { id: "sweet_soy", name: "น้ำจิ้มสุกี้", unit: "ช้อนชา", mgPerUnit: 93 },
  { id: "chili_sauce", name: "ซอสพริก", unit: "ช้อนชา", mgPerUnit: 77 },
  { id: "chicken_dip", name: "น้ำจิ้มไก่", unit: "ช้อนชา", mgPerUnit: 70 },
  { id: "tomato_sauce", name: "ซอสมะเขือเทศ", unit: "ช้อนชา", mgPerUnit: 47 },
  { id: "fermented_beans", name: "ถั่วเน่า", unit: "แผ่น", mgPerUnit: 240 },
] as const;

const MEAL_LIMIT = 400; // mg ต่อมื้อ
const DAY_LIMIT = 2000; // mg ต่อวัน

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function Badge({ tone = "gray", children }: { tone?: "green" | "yellow" | "red" | "gray"; children: React.ReactNode }) {
  const map = {
    green: "bg-gradient-to-r from-emerald-100 to-green-100 text-green-700 ring-green-300 shadow-sm",
    yellow: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 ring-yellow-300 shadow-sm",
    red: "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 ring-red-300 shadow-sm",
    gray: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 ring-gray-300 shadow-sm",
  } as const;
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ring-1 font-kanit ${map[tone]}`}>
      {children}
    </span>
  );
}

function Progress({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = clamp((value / max) * 100, 0, 100);
  let tone: "green" | "yellow" | "red" = "green";
  if (pct >= 100 || value > max) tone = "red"; 
  else if (pct >= 70) tone = "yellow"; 
  else tone = "green";
  
  const barTone = {
    green: "bg-gradient-to-r from-emerald-400 to-green-500",
    yellow: "bg-gradient-to-r from-yellow-400 to-amber-500",
    red: "bg-gradient-to-r from-red-400 to-pink-500",
  }[tone];
  
  return (
    <div className="w-full">
      {label && <div className="mb-3 text-sm text-gray-600 font-kanit flex items-center gap-2">
        <Target size={16} />
        {label}
      </div>}
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div className={`h-4 ${barTone} transition-all duration-700 ease-out shadow-sm`} 
             style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-600 font-kanit">
          {Math.round(value).toLocaleString()} / {max.toLocaleString()} มก.
        </span>
        <span className={`text-sm font-medium font-kanit ${
          tone === 'green' ? 'text-green-600' : 
          tone === 'yellow' ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

function QuickQty({ onPick, unit }: { onPick: (v: number) => void; unit: string }) {
  const opts = [0, 0.25, 0.5, 0.75, 1];
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {opts.map((v) => (
        <button
          key={v}
          onClick={() => onPick(v)}
          className="px-3 py-1.5 text-sm rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 
                   hover:from-blue-100 hover:to-indigo-100 border border-blue-200 
                   hover:border-blue-300 transition-all duration-200 font-kanit
                   hover:shadow-md active:scale-95"
        >
          {v === 0 ? "🗑️ ล้าง" : v === 1 ? `1 ${unit}` : `${v} ${unit}`}
        </button>
      ))}
    </div>
  );
}

export default function SodiumCalculator() {
  const [meals, setMeals] = useState([{ id: Date.now(), qty: {} as Record<string, number> }]);
  const navigate = useNavigate();
  
  const addMeal = () => setMeals((ms) => [...ms, { id: Date.now(), qty: {} }]);
  const removeMeal = (id: number) => setMeals((ms) => ms.filter((m) => m.id !== id));

  const dayTotal = useMemo(
    () => meals.reduce((sum, meal) => sum + ITEMS.reduce((s, item) => s + (meal.qty[item.id] ?? 0) * item.mgPerUnit, 0), 0),
    [meals]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-700"></div>
        </div>
        
        <div className="relative px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="w-8 h-8 mr-3 text-blue-200" />
              <h1 className="font-bold text-4xl md:text-5xl font-kanit text-center">
                คำนวณปริมาณโซเดียมรายวัน
              </h1>
            </div>
            <p className="text-blue-100 font-kanit text-lg text-center max-w-3xl mx-auto">
              เครื่องมือคำนวณโซเดียมสำหรับการดูแลสุขภาพ เพิ่มหลายมื้อและติดตามปริมาณโซเดียมต่อวัน
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-sm text-blue-200">เกณฑ์ต่อมื้อ</div>
                  <div className="text-xl font-bold">≤ {MEAL_LIMIT} มก.</div>
                </div>
                <div className="w-px h-8 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-sm text-blue-200">เกณฑ์ต่อวัน</div>
                  <div className="text-xl font-bold">≤ {DAY_LIMIT} มก.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Navigation Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/menusodium")}
            className="flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-600 
                     hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 
                     rounded-2xl font-kanit text-lg font-medium shadow-lg 
                     hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <TrendingUp size={22} />
            การเปรียบเทียบโซเดียมในเมนูอาหาร
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Daily Total Summary */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 
                            rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 font-kanit">โซเดียมรวมทั้งวัน</h2>
                <p className="text-gray-600 font-kanit">ติดตามปริมาณโซเดียมสะสมรายวัน</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-800 font-kanit">
                {Math.round(dayTotal).toLocaleString()} 
                <span className="text-lg text-gray-500 ml-2">มก.</span>
              </div>
              <Badge tone={dayTotal > DAY_LIMIT ? "red" : dayTotal > DAY_LIMIT * 0.7 ? "yellow" : "green"}>
                {dayTotal <= DAY_LIMIT ? "✅ ปลอดภัย" : "⚠️ เกินเกณฑ์"}
              </Badge>
            </div>
          </div>
          <Progress value={dayTotal} max={DAY_LIMIT} label="เปรียบเทียบกับเกณฑ์มาตรฐาน 2,000 มก./วัน" />
        </div>

        {/* Meals Section */}
        <div className="space-y-8">
          {meals.map((meal, idx) => {
            const mealTotal = ITEMS.reduce((sum, item) => sum + (meal.qty[item.id] ?? 0) * item.mgPerUnit, 0);
            const mealTone = mealTotal > MEAL_LIMIT ? "red" : mealTotal > MEAL_LIMIT * 0.7 ? "yellow" : "green";

            return (
              <div key={meal.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Meal Header */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 
                                    rounded-xl flex items-center justify-center shadow-md">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 font-kanit">มื้อที่ {idx + 1}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-2xl font-bold text-gray-800 font-kanit">
                            {Math.round(mealTotal).toLocaleString()} มก.
                          </span>
                          <Badge tone={mealTone as any}>
                            {mealTotal <= MEAL_LIMIT ? "อยู่ในเกณฑ์" : "เกินเกณฑ์"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {meals.length > 1 && (
                      <button
                        onClick={() => removeMeal(meal.id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 
                                 hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-kanit"
                      >
                        <Trash2 size={18} />
                        ลบมื้อนี้
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Progress value={mealTotal} max={MEAL_LIMIT} label="เปรียบเทียบกับเกณฑ์ 400 มก./มื้อ" />
                  </div>
                </div>

                {/* Ingredients Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {ITEMS.map((item) => {
                      const q = meal.qty[item.id] ?? 0;
                      const mg = q * item.mgPerUnit;
                      const tone: "green" | "yellow" | "red" = mg === 0 ? "green" : mg <= 200 ? "green" : mg <= 400 ? "yellow" : "red";

                      return (
                        <div key={item.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl 
                                                    border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex-grow">
                              <h4 className="text-lg font-semibold text-gray-800 font-kanit">{item.name}</h4>
                              <p className="text-sm text-gray-500 font-kanit mt-1">
                                💧 {item.mgPerUnit.toLocaleString()} มก. ต่อ 1 {item.unit}
                              </p>
                            </div>
                            <Badge tone={tone}>
                              {mg ? `${Math.round(mg).toLocaleString()} มก.` : "0 มก."}
                            </Badge>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 font-kanit mb-2">
                              จำนวนที่ใช้ ({item.unit})
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min={0}
                                step={0.25}
                                value={q}
                                onChange={(e) => setMeals((ms) => ms.map((m) => 
                                  m.id === meal.id 
                                    ? { ...m, qty: { ...m.qty, [item.id]: Number(e.target.value) } } 
                                    : m
                                ))}
                                className="flex-grow px-4 py-3 rounded-xl border-2 border-gray-200 
                                         focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                                         outline-none bg-white font-kanit text-lg transition-all"
                                placeholder="0"
                              />
                              <button
                                className="px-4 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 
                                         hover:from-gray-200 hover:to-gray-300 text-gray-700 font-kanit
                                         border border-gray-300 hover:border-gray-400 transition-all"
                                onClick={() => setMeals((ms) => ms.map((m) => 
                                  m.id === meal.id 
                                    ? { ...m, qty: { ...m.qty, [item.id]: 0 } } 
                                    : m
                                ))}
                              >
                                ล้าง
                              </button>
                            </div>
                            <QuickQty 
                              unit={item.unit} 
                              onPick={(v) => setMeals((ms) => ms.map((m) => 
                                m.id === meal.id 
                                  ? { ...m, qty: { ...m.qty, [item.id]: v } } 
                                  : m
                              ))} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Meal Button */}
        <div className="text-center">
          <button
            onClick={addMeal}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 
                     hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 
                     rounded-2xl font-kanit text-lg font-medium shadow-lg 
                     hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus size={22} />
            เพิ่มมื้ออาหารใหม่
          </button>
        </div>

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 font-kanit mb-2">ข้อมูลสำคัญ</h4>
              <p className="text-sm text-gray-600 font-kanit leading-relaxed">
                แหล่งข้อมูล: ตารางปริมาณโซเดียมต่อหน่วยของเครื่องปรุงรสต่างๆ 
                เครื่องมือนี้ใช้สำหรับการประเมินเบื้องต้นเท่านั้น 
                หากมีโรคประจำตัวหรือต้องการคำแนะนำเฉพาะบุคคล กรุณาปรึกษาแพทย์หรือนักโภชนาการ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}