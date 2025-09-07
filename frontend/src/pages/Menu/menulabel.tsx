import React from "react";

/**
 * Enhanced UI สรุปฉลากโภชนาการไทย 3 แบบ - สวยงาม สมดุล และทันสมัย
 * - แบบเต็ม (15 รายการ)
 * - แบบย่อ (8 รายการ)  
 * - แบบหวาน-มัน-เค็ม หรือ GDA (Front-of-Pack)
 *
 * ใช้ TailwindCSS พร้อม animations และ modern design
 */

// ---------- Types ----------
export type Nutrient = {
  key: string;
  label: string;
  amount?: string;
  percent?: string;
};

export type FullLabelData = {
  productName: string;
  brand?: string;
  servingPerPack?: string;
  servingSize?: string;
  energyPerServing?: string;
  energyFromFat?: string;
  nutrients: Nutrient[];
  footnote?: string;
};

export type ShortLabelData = {
  productName: string;
  servingPerPack?: string;
  servingSize?: string;
  energyPerServing?: string;
  nutrients: Nutrient[];
  footnote?: string;
};

export type GDAData = {
  perUnitLabel?: string;
  shareHint?: string;
  energy?: { value: string; percent?: string };
  sugar?: { value: string; percent?: string };
  fat?: { value: string; percent?: string };
  sodium?: { value: string; percent?: string };
};

// ---------- Enhanced UI Components ----------
const SectionTitle: React.FC<{ title: string; subtitle?: string; icon?: string }> = ({ title, subtitle, icon }) => (
  <div className="flex items-center gap-4 mb-8">
    {icon && (
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-white text-xl">{icon}</span>
      </div>
    )}
    <div className="flex-1">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="text-gray-600 mt-1 font-medium text-sm sm:text-base">{subtitle}</p>
      )}
    </div>
  </div>
);

const Card: React.FC<{ 
  className?: string; 
  children: React.ReactNode; 
  variant?: 'default' | 'gradient' | 'glass';
  hover?: boolean;
}> = ({ 
  className = "", 
  children, 
  variant = 'default',
  hover = true 
}) => {
  const baseClasses = "rounded-3xl border shadow-xl transition-all duration-500 ease-out p-8";
  
  const variantClasses = {
    default: 'bg-white border-gray-100',
    gradient: 'bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 border-blue-100/50',
    glass: 'bg-white/70 backdrop-blur-xl border-white/20'
  };
  
  const hoverClasses = hover 
    ? 'hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1' 
    : '';

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

const KeyValue: React.FC<{ 
  k: string; 
  v?: string; 
  highlight?: boolean;
  size?: 'sm' | 'md';
}> = ({ k, v, highlight = false, size = 'md' }) => {
  const sizeClasses = size === 'sm' 
    ? 'py-3 px-4 text-sm' 
    : 'py-4 px-5 text-base';

  return (
    <div className={`
      flex items-start justify-between gap-4 ${sizeClasses} rounded-2xl 
      transition-all duration-300 ease-out
      ${highlight 
        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm' 
        : 'hover:bg-gray-50/70'
      }
    `}>
      <span className="text-gray-700 font-medium leading-relaxed">{k}</span>
      <span className={`font-bold text-right leading-relaxed ${
        highlight ? 'text-indigo-700' : 'text-gray-900'
      }`}>
        {v ?? "—"}
      </span>
    </div>
  );
};

const Divider: React.FC<{ variant?: 'default' | 'gradient' | 'dotted' }> = ({ variant = 'gradient' }) => {
  const variantClasses = {
    default: 'border-t border-gray-200',
    gradient: 'h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent',
    dotted: 'border-t-2 border-dotted border-gray-300'
  };

  return (
    <div className={`my-8 ${variantClasses[variant]}`} />
  );
};

// ---------- Enhanced Full Label ----------
const FullNutritionLabel: React.FC<{ data: FullLabelData }> = ({ data }) => {
  return (
    <Card variant="gradient">
      <SectionTitle 
        title="ฉลากโภชนาการแบบเต็ม" 
        subtitle="แสดงสารอาหารสำคัญครบถ้วน 15 รายการ"
        icon="📊"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-2">
          <KeyValue k="ชื่อผลิตภัณฑ์" v={data.productName} highlight />
          {data.brand && <KeyValue k="ยี่ห้อ" v={data.brand} />}
          <KeyValue k="จำนวนหน่วยบริโภคต่อบรรจุภัณฑ์" v={data.servingPerPack} />
        </div>
        <div className="space-y-2">
          <KeyValue k="ขนาดหน่วยบริโภค" v={data.servingSize} />
          <KeyValue k="พลังงานต่อ 1 หน่วยบริโภค" v={data.energyPerServing} highlight />
          {data.energyFromFat && <KeyValue k="พลังงานที่ได้จากไขมัน" v={data.energyFromFat} />}
        </div>
      </div>

      <Divider />

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="col-span-6 text-base font-bold text-gray-800">สารอาหาร</div>
          <div className="col-span-3 text-right text-base font-bold text-gray-800">ปริมาณ</div>
          <div className="col-span-3 text-right text-base font-bold text-gray-800">%RDI*</div>
        </div>
        
        <div className="space-y-3">
          {data.nutrients.map((n, idx) => (
            <div 
              key={n.key} 
              className={`
                grid grid-cols-12 gap-4 py-5 px-5 rounded-2xl 
                transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5
                ${idx % 2 === 0 
                  ? 'bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-transparent hover:from-blue-50 hover:to-indigo-50/50' 
                  : 'bg-gradient-to-r from-purple-50/50 via-pink-50/30 to-transparent hover:from-purple-50 hover:to-pink-50/50'
                }
              `}
            >
              <div className="col-span-6 text-base font-semibold text-gray-800 leading-relaxed">{n.label}</div>
              <div className="col-span-3 text-right text-base font-bold text-gray-700">{n.amount ?? "—"}</div>
              <div className={`col-span-3 text-right text-base font-bold ${
                n.percent && n.percent !== '—' && n.percent !== '-' 
                  ? 'text-indigo-600' 
                  : 'text-gray-400'
              }`}>
                {n.percent ?? "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {data.footnote && (
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border border-amber-200 shadow-sm">
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            <span className="font-bold">*</span> {data.footnote}
          </p>
        </div>
      )}
    </Card>
  );
};

// ---------- Enhanced Short Label ----------
const ShortNutritionLabel: React.FC<{ data: ShortLabelData }> = ({ data }) => {
  return (
    <Card variant="glass" className="mb-8">
      <SectionTitle 
        title="ฉลากโภชนาการแบบย่อ" 
        subtitle="แสดงสารอาหารหลัก 8 รายการ"
        icon="📋"
      />
      
      <div className="space-y-3 mb-6">
        <KeyValue k="ชื่อผลิตภัณฑ์" v={data.productName} highlight size="sm" />
        <KeyValue k="จำนวนหน่วยบริโภคต่อบรรจุภัณฑ์" v={data.servingPerPack} size="sm" />
        <KeyValue k="ขนาดหน่วยบริโภค" v={data.servingSize} size="sm" />
        <KeyValue k="พลังงานต่อ 1 หน่วยบริโภค" v={data.energyPerServing} highlight size="sm" />
      </div>

      <Divider />

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
          <div className="col-span-6 text-sm font-bold text-gray-800">สารอาหาร</div>
          <div className="col-span-3 text-right text-sm font-bold text-gray-800">ปริมาณ</div>
          <div className="col-span-3 text-right text-sm font-bold text-gray-800">%RDI*</div>
        </div>
        
        <div className="space-y-2">
          {data.nutrients.map((n, idx) => (
            <div 
              key={n.key} 
              className={`
                grid grid-cols-12 gap-3 py-4 px-4 rounded-xl 
                transition-all duration-300 ease-out hover:shadow-sm hover:-translate-y-0.5
                ${idx % 2 === 0 
                  ? 'bg-gradient-to-r from-emerald-50/60 to-transparent hover:from-emerald-50' 
                  : 'bg-gradient-to-r from-green-50/60 to-transparent hover:from-green-50'
                }
              `}
            >
              <div className="col-span-6 text-sm font-semibold text-gray-800 leading-relaxed">{n.label}</div>
              <div className="col-span-3 text-right text-sm font-bold text-gray-700">{n.amount ?? "—"}</div>
              <div className={`col-span-3 text-right text-sm font-bold ${
                n.percent && n.percent !== '—' && n.percent !== '-' 
                  ? 'text-emerald-600' 
                  : 'text-gray-400'
              }`}>
                {n.percent ?? "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {data.footnote && (
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-xs text-emerald-800 font-medium leading-relaxed">
            <span className="font-bold">*</span> {data.footnote}
          </p>
        </div>
      )}
    </Card>
  );
};

// ---------- Enhanced GDA Pills ----------
const GDAPill: React.FC<{ 
  title: string; 
  value: string; 
  percent?: string; 
  color: 'energy' | 'sugar' | 'fat' | 'sodium';
  index: number;
}> = ({ title, value, percent, color, index }) => {
  const colorClasses = {
    energy: 'from-orange-400 via-red-500 to-pink-500',
    sugar: 'from-pink-400 via-rose-500 to-red-500', 
    fat: 'from-amber-400 via-yellow-500 to-orange-500',
    sodium: 'from-blue-400 via-indigo-500 to-purple-500'
  };

  const shadowClasses = {
    energy: 'shadow-orange-200 hover:shadow-orange-300',
    sugar: 'shadow-pink-200 hover:shadow-pink-300',
    fat: 'shadow-yellow-200 hover:shadow-yellow-300',
    sodium: 'shadow-blue-200 hover:shadow-blue-300'
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-3xl bg-gradient-to-br ${colorClasses[color]} 
        shadow-xl ${shadowClasses[color]} 
        transition-all duration-500 ease-out
        hover:scale-105 hover:-translate-y-2 hover:rotate-1
        p-8 text-white group cursor-pointer
        transform-gpu
      `}
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
      
      <div className="relative z-10">
        <div className="text-xs font-bold uppercase tracking-wider opacity-90 mb-3 leading-tight">
          {title}
        </div>
        <div className="text-3xl sm:text-4xl font-black leading-none mb-4 drop-shadow-sm">
          {value}
        </div>
        {percent && (
          <div className="text-sm font-semibold bg-white/25 backdrop-blur-sm px-3 py-2 rounded-full inline-block border border-white/30">
            {percent}
          </div>
        )}
      </div>
      
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
    </div>
  );
};

const GDACard: React.FC<{ data: GDAData }> = ({ data }) => (
  <Card>
    <SectionTitle 
      title="ฉลากหวาน มัน เค็ม" 
      subtitle="Front-of-Pack Guideline Daily Amounts"
      icon="🚨"
    />
    
    <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200 shadow-sm">
      <div className="font-bold text-indigo-900 mb-2 text-lg">
        คุณค่าทางโภชนาการต่อ {data.perUnitLabel ?? "1 หน่วยบริโภค"}
      </div>
      {data.shareHint && (
        <div className="text-sm text-indigo-700 font-semibold bg-white/60 px-3 py-1 rounded-full inline-block">
          {data.shareHint}
        </div>
      )}
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <GDAPill 
        title="พลังงาน" 
        value={data.energy?.value ?? "—"} 
        percent={data.energy?.percent} 
        color="energy"
        index={0}
      />
      <GDAPill 
        title="น้ำตาล" 
        value={data.sugar?.value ?? "—"} 
        percent={data.sugar?.percent} 
        color="sugar"
        index={1}
      />
      <GDAPill 
        title="ไขมัน" 
        value={data.fat?.value ?? "—"} 
        percent={data.fat?.percent} 
        color="fat"
        index={2}
      />
      <GDAPill 
        title="โซเดียม" 
        value={data.sodium?.value ?? "—"} 
        percent={data.sodium?.percent} 
        color="sodium"
        index={3}
      />
    </div>
  </Card>
);

// ---------- Demo data ----------
const demoFull: FullLabelData = {
  productName: "บิสกิตรสนม",
  brand: "แบรนด์ตัวอย่าง",
  servingPerPack: "ประมาณ 2 หน่วยบริโภค",
  servingSize: "1 ซอง (30 กรัม)",
  energyPerServing: "150 กิโลแคลอรี",
  energyFromFat: "60 กิโลแคลอรี",
  footnote: "ร้อยละของปริมาณสารอาหารอ้างอิงที่ควรได้รับประจำวัน (Thai RDI) คิดจากความต้องการพลังงาน 2,000 กิโลแคลอรีต่อวัน",
  nutrients: [
    { key: "fat", label: "ไขมันทั้งหมด", amount: "8 กรัม", percent: "12%" },
    { key: "satfat", label: "ไขมันอิ่มตัว", amount: "3 กรัม", percent: "15%" },
    { key: "trans", label: "กรดไขมันทรานส์", amount: "0 กรัม", percent: "—" },
    { key: "chol", label: "คอเลสเตอรอล", amount: "5 มก.", percent: "2%" },
    { key: "protein", label: "โปรตีน", amount: "2 กรัม", percent: "4%" },
    { key: "carb", label: "คาร์โบไฮเดรตทั้งหมด", amount: "19 กรัม", percent: "6%" },
    { key: "sugar", label: "น้ำตาล", amount: "10 กรัม", percent: "16%" },
    { key: "fiber", label: "ใยอาหาร", amount: "1 กรัม", percent: "4%" },
    { key: "sodium", label: "โซเดียม", amount: "170 มก.", percent: "9%" },
    { key: "calcium", label: "แคลเซียม", amount: "40 มก.", percent: "5%" },
    { key: "iron", label: "ธาตุเหล็ก", amount: "0.7 มก.", percent: "5%" },
    { key: "vitA", label: "วิตามินเอ", amount: "—", percent: "—" },
    { key: "vitB1", label: "วิตามินบี1", amount: "—", percent: "—" },
    { key: "vitB2", label: "วิตามินบี2", amount: "—", percent: "—" },
    { key: "vitC", label: "วิตามินซี", amount: "—", percent: "—" },
  ],
};

const demoShort: ShortLabelData = {
  productName: "บิสกิตรสนม",
  servingPerPack: "ประมาณ 2 หน่วยบริโภค",
  servingSize: "1 ซอง (30 กรัม)",
  energyPerServing: "150 กิโลแคลอรี",
  footnote: "ร้อยละของปริมาณสารอาหารอ้างอิงต่อวัน (Thai RDI) 2,000 กิโลแคลอรี",
  nutrients: [
    { key: "fat", label: "ไขมันทั้งหมด", amount: "8 กรัม", percent: "12%" },
    { key: "satfat", label: "ไขมันอิ่มตัว", amount: "3 กรัม", percent: "15%" },
    { key: "chol", label: "คอเลสเตอรอล", amount: "5 มก.", percent: "2%" },
    { key: "protein", label: "โปรตีน", amount: "2 กรัม", percent: "4%" },
    { key: "carb", label: "คาร์โบไฮเดรตทั้งหมด", amount: "19 กรัม", percent: "6%" },
    { key: "sugar", label: "น้ำตาล", amount: "10 กรัม", percent: "16%" },
    { key: "fiber", label: "ใยอาหาร", amount: "1 กรัม", percent: "4%" },
    { key: "sodium", label: "โซเดียม", amount: "170 มก.", percent: "9%" },
  ],
};

const demoGDA: GDAData = {
  perUnitLabel: "1 ซอง",
  shareHint: "ควรแบ่งกัน 5 ครั้ง",
  energy: { value: "340 กิโลแคลอรี", percent: "≈17%" },
  sugar: { value: "10 กรัม", percent: "≈19%" },
  fat: { value: "18 กรัม", percent: "≈28%" },
  sodium: { value: "170 มิลลิกรัม", percent: "≈7%" },
};

// ---------- Enhanced Main Page ----------
export default function NutritionLabelUI() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 relative overflow-hidden font-kanit">
      {/* Enhanced floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-purple-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-br from-pink-400/15 via-orange-400/10 to-yellow-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-12">
        <header className="mx-auto max-w-8xl mb-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
              <span className="text-3xl animate-bounce">🏷️</span>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              ฉลากโภชนาการไทย
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed mb-8">
            ตัวอย่าง สำหรับฉลากแบบเต็ม / แบบย่อ / หวาน-มัน-เค็ม (GDA) 
            
          </p>
          
          <div className="flex justify-center mb-8">
            <div className="h-2 w-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg animate-pulse" />
          </div>
        </header>

        <main className="mx-auto max-w-8xl">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-12">
            <div className="xl:col-span-3">
              <FullNutritionLabel data={demoFull} />
            </div>
            <div className="xl:col-span-2 space-y-8">
              <ShortNutritionLabel data={demoShort} />
              <GDACard data={demoGDA} />
            </div>
          </div>
        </main>

        <footer className="mx-auto max-w-8xl mt-16">
          <Card variant="glass" hover={false} className="text-center">
            <div className="mt-8 flex justify-center space-x-3">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </Card>
        </footer>
      </div>

     
    </div>
  );
}