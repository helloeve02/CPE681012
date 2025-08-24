import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    green: "bg-green-100 text-green-700 ring-green-200",
    yellow: "bg-yellow-100 text-yellow-700 ring-yellow-200",
    red: "bg-red-100 text-red-700 ring-red-200",
    gray: "bg-gray-100 text-gray-700 ring-gray-200",
  } as const;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${map[tone]}`}>
      {children}
    </span>
  );
}

function Progress({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = clamp((value / max) * 100, 0, 100);
  let tone: "green" | "yellow" | "red" = "green";
  if (pct >= 100 || value > max) tone = "red"; else if (pct >= 70) tone = "yellow"; else tone = "green";
  const barTone = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  }[tone];
  return (
    <div className="w-full">
      {label && <div className="mb-1 text-sm text-gray-600">{label}</div>}
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-3 ${barTone}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-xs text-gray-600">{Math.round(value)} / {max} มก. ({Math.round(pct)}%)</div>
    </div>
  );
}

function QuickQty({ onPick, unit }: { onPick: (v: number) => void; unit: string }) {
  const opts = [0, 0.25, 0.5, 0.75, 1];
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {opts.map((v) => (
        <button
          key={v}
          onClick={() => onPick(v)}
          className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200 transition"
        >
          {v === 0 ? "ล้าง" : v === 1 ? `1 ${unit}` : `${v} ${unit}`}
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
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 text-slate-800 p-4 sm:p-6 font-kanit">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4 ">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight font-kanit">คำนวณปริมาณโซเดียมรายวัน</h1>
            <p className="text-sm text-gray-600 mt-1 font-kanit">เพิ่มหลายมื้อ คำนวณรวมโซเดียมต่อวันอัตโนมัติ</p>
          </div>
          <Badge tone="gray">≤ {MEAL_LIMIT} มก./มื้อ • ≤ {DAY_LIMIT} มก./วัน</Badge>
        </header>
        <div className="flex justify-end mt-6">
          <button
            onClick={() => navigate("/menusodium")}
            className="px-6 py-3 bg-red-600 text-white text-sm
               rounded-2xl shadow-md hover:bg-red-700 
               focus:outline-none focus:ring-2 focus:ring-red-400 
               transition-all duration-300"
          >
            <p>การเปรียบเทียบโซเดียมในเมนูอาหาร</p>
          </button>
        </div>

        {/* รวมทั้งวัน */}
        <div className="p-4 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">โซเดียมรวมทั้งวัน</div>
              <div className="text-3xl font-bold mt-1">{Math.round(dayTotal)} มก.</div>
            </div>
          </div>
          <div className="mt-3">
            <Progress value={dayTotal} max={DAY_LIMIT} label="สัดส่วนต่อเกณฑ์ 2000 มก./วัน" />
          </div>
        </div>

        {/* มื้ออาหาร */}
        {meals.map((meal, idx) => {
          const mealTotal = ITEMS.reduce((sum, item) => sum + (meal.qty[item.id] ?? 0) * item.mgPerUnit, 0);
          const mealTone = mealTotal > MEAL_LIMIT ? "red" : mealTotal > MEAL_LIMIT * 0.7 ? "yellow" : "green";

          return (
            <div key={meal.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">มื้อ {idx + 1}</h2>
                {meals.length > 1 && (
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="text-sm text-red-500 hover:underline"
                  >ลบมื้อนี้</button>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">โซเดียมรวมในมื้อนี้</div>
                    <div className="text-2xl font-bold mt-1">{Math.round(mealTotal)} มก.</div>
                  </div>
                  <Badge tone={mealTone as any}>{mealTotal <= MEAL_LIMIT ? "อยู่ในเกณฑ์" : "เกินเกณฑ์"}</Badge>
                </div>
                <div className="mt-3">
                  <Progress value={mealTotal} max={MEAL_LIMIT} label="สัดส่วนต่อเกณฑ์ 400 มก./มื้อ" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {ITEMS.map((item) => {
                  const q = meal.qty[item.id] ?? 0;
                  const mg = q * item.mgPerUnit;
                  const tone: "green" | "yellow" | "red" = mg === 0 ? "green" : mg <= 200 ? "green" : mg <= 400 ? "yellow" : "red";

                  return (
                    <div key={item.id} className="p-4 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{`ต่อ 1 ${item.unit} = ${item.mgPerUnit.toLocaleString()} มก.`}</div>
                        </div>
                        <Badge tone={tone}>{mg ? `${Math.round(mg)} มก.` : "0 มก."}</Badge>
                      </div>

                      <div className="mt-3">
                        <label className="text-sm text-gray-700">จำนวนที่ใช้ ({item.unit})</label>
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            step={0.25}
                            value={q}
                            onChange={(e) => setMeals((ms) => ms.map((m) => m.id === meal.id ? { ...m, qty: { ...m.qty, [item.id]: Number(e.target.value) } } : m))}
                            className="w-28 px-3 py-2 rounded-xl ring-1 ring-gray-300 focus:ring-2 focus:ring-sky-400 outline-none bg-white"
                          />
                          <button
                            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm"
                            onClick={() => setMeals((ms) => ms.map((m) => m.id === meal.id ? { ...m, qty: { ...m.qty, [item.id]: 0 } } : m))}
                          >ล้าง</button>
                        </div>
                        <QuickQty unit={item.unit} onPick={(v) => setMeals((ms) => ms.map((m) => m.id === meal.id ? { ...m, qty: { ...m.qty, [item.id]: v } } : m))} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="pt-4">
          <button
            onClick={addMeal}
            className="px-4 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 shadow"
          >+ เพิ่มมื้อ</button>
        </div>

        <footer className="text-xs text-gray-500 pt-2 pb-6">
          แหล่งข้อมูล: ตารางปริมาณโซเดียมต่อหน่วยของเครื่องปรุง (สองภาพที่ให้มา). ใช้เพื่อการประเมินเบื้องต้น.
        </footer>
      </div>
    </div>
  );
}
