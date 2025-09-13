// FluidCalculator.tsx
import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Droplets,
  User,
  AlertCircle,
  Info,
  Activity,
  RefreshCw,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react';

/** ---------- Utilities ---------- */
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const toNumber = (s: string) => {
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};
const roundTo50 = (x: number) => Math.round(x / 50) * 50;

/** ---------- Types ---------- */
interface PatientData {
  weight: number;
  age: number;
  gender: 'male' | 'female';
  // CKD specific
  ckdStage: number;
  urineOutput: number;
  edema: boolean;
  hypertension: boolean;
  heartFailure: boolean;
  // Diabetes specific
  diabetesType: number;
  hba1c: number;
  bloodPressure: { systolic: number; diastolic: number };
  diabeticComplications: {
    nephropathy: boolean;
    retinopathy: boolean;
    neuropathy: boolean;
    cardiovascular: boolean;
  };
  medications: {
    diuretics: boolean;
    acei: boolean; // reserved
    insulin: boolean;
  };
}

type CalculationType = 'ckd' | 'diabetes';
type Tone = 'green' | 'yellow' | 'red' | 'gray';

/** ---------- UI Subcomponents ---------- */
function Badge({ tone = 'gray', children }: { tone?: Tone; children: React.ReactNode }) {
  const map: Record<Tone, string> = {
    green: 'bg-gradient-to-r from-emerald-100 to-green-100 text-green-700 ring-green-300 shadow-sm',
    yellow: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 ring-yellow-300 shadow-sm',
    red: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 ring-red-300 shadow-sm',
    gray: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 ring-gray-300 shadow-sm',
  };
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ring-1 ${map[tone]}`}>
      {children}
    </span>
  );
}

function Progress({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = Math.min((value / Math.max(1, max)) * 100, 100);
  let tone: Exclude<Tone, 'gray'> = 'green';
  if (pct >= 100 || value > max) tone = 'red';
  else if (pct >= 80) tone = 'yellow';

  const barTone = {
    green: 'bg-gradient-to-r from-emerald-400 to-green-500',
    yellow: 'bg-gradient-to-r from-yellow-400 to-amber-500',
    red: 'bg-gradient-to-r from-red-400 to-pink-500',
  }[tone];

  return (
    <div className="w-full">
      {label && (
        <div className="mb-3 text-sm text-gray-600 flex items-center gap-2">
          <Target size={16} />
          {label}
        </div>
      )}
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div className={`h-4 ${barTone} transition-all duration-700 ease-out shadow-sm`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {Math.round(value).toLocaleString()} / {Math.round(max).toLocaleString()} ml
        </span>
        <span
          className={`text-sm font-medium ${
            tone === 'green' ? 'text-green-600' : tone === 'yellow' ? 'text-yellow-600' : 'text-red-600'
          }`}
        >
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

/** ---------- Main Component ---------- */
const FluidCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>('ckd');

  const defaultPatientData: PatientData = {
    weight: 0,
    age: 0,
    gender: 'male',
    // CKD
    ckdStage: 0,
    urineOutput: 0,
    edema: false,
    hypertension: false,
    heartFailure: false,
    // Diabetes
    diabetesType: 0,
    hba1c: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    diabeticComplications: {
      nephropathy: false,
      retinopathy: false,
      neuropathy: false,
      cardiovascular: false,
    },
    medications: {
      diuretics: false,
      acei: false,
      insulin: false,
    },
  };

  const [patientData, setPatientData] = useState<PatientData>({ ...defaultPatientData });

  const [result, setResult] = useState<{
    dailyFluidLimit: number;
    recommendations: string[];
    riskLevel: 'low' | 'moderate' | 'high';
  } | null>(null);

  /** ---------- Input readiness ---------- */
  const isInputReady = () => {
    if (patientData.weight < 20) return false; // กันเคสผิดปกติ
    if (calculationType === 'ckd') return patientData.ckdStage > 0;
    return true; // diabetes ต้องการอย่างน้อยน้ำหนัก
  };

  /** ---------- CKD calculation ---------- */
  const calculateCKDFluidLimit = () => {
    let baseFluid = 0;

    // ตรรกะอิงแนวทาง (ประยุกต์ใช้ในแอป)
    switch (patientData.ckdStage) {
      case 1:
      case 2:
        baseFluid = patientData.weight * 32.5; // 30–35 ml/kg/day
        break;
      case 3:
        if (patientData.edema || patientData.hypertension || patientData.heartFailure) {
          baseFluid = patientData.urineOutput + 500;
        } else {
          baseFluid = patientData.weight * 30;
        }
        break;
      case 4:
      case 5:
        baseFluid = patientData.urineOutput + 600; // 500–700 ml (เฉลี่ย)
        if (patientData.urineOutput < 400) baseFluid = patientData.urineOutput + 500;
        break;
      default:
        baseFluid = patientData.weight * 30;
    }

    // ปรับตามภาวะแทรกซ้อน
    if (patientData.edema) baseFluid *= 0.85;
    if (patientData.heartFailure) baseFluid *= 0.8;

    // พื้นขั้นต่ำเพื่อชดเชย insensible loss + เพดานตามน้ำหนัก
    const floor = 800;
    const cap = patientData.weight * 30; // กัน overshoot
    const out = clamp(baseFluid, floor, cap);
    return roundTo50(out);
  };

  /** ---------- Diabetes calculation ---------- */
  const calculateDiabetesFluidLimit = () => {
    let baseFluid = patientData.weight * 32.5; // 30–35 ml/kg/day

    // Age adjustment
    if (patientData.age > 75) baseFluid = patientData.weight * 25;
    else if (patientData.age > 65) baseFluid = patientData.weight * 27.5;

    // HbA1c → osmotic diuresis
    if (patientData.hba1c > 10) baseFluid *= 1.25;
    else if (patientData.hba1c > 9) baseFluid *= 1.15;

    // Blood pressure
    const { systolic, diastolic } = patientData.bloodPressure;
    if (systolic > 160 || diastolic > 100) baseFluid *= 0.9;
    else if (systolic > 140 || diastolic > 90) baseFluid *= 0.95;

    // Complications
    if (patientData.diabeticComplications.nephropathy) {
      // ใช้สูตร CKD
      baseFluid = patientData.urineOutput > 0 ? patientData.urineOutput + 500 : patientData.weight * 25;
    }
    if (patientData.diabeticComplications.cardiovascular) baseFluid *= 0.9;

    // Medications
    if (patientData.medications.diuretics) baseFluid *= 0.85;

    // ใส่เพดานรวมเพื่อกัน overshoot จาก factor ผสม
    const cap = patientData.weight * 45;
    const out = Math.min(baseFluid, cap);
    return roundTo50(out);
  };

  /** ---------- Recommendations ---------- */
  const getCKDRecommendations = () => {
    const r: string[] = [];

    if (patientData.ckdStage === 1 || patientData.ckdStage === 2) {
      r.push('CKD Stage 1–2: ยังไม่ต้องจำกัดน้ำเข้มงวด ดื่มตามความต้องการของร่างกาย');
      r.push('ติดตามการทำงานของไตและควบคุมความดันโลหิตสม่ำเสมอ');
    } else if (patientData.ckdStage === 3) {
      r.push('CKD Stage 3: เริ่มเฝ้าระวังการดื่มน้ำ โดยเฉพาะถ้ามีอาการบวม');
      r.push('จดบันทึกปริมาณปัสสาวะและน้ำหนักตัวทุกวัน');
    } else if (patientData.ckdStage >= 4) {
      r.push('CKD Stage 4–5: จำกัดน้ำตามสูตร “ปัสสาวะ 24 ชม. + 500–700 มล.”');
      r.push('ปรึกษาแพทย์เฉพาะทางไตและโภชนากรอย่างสม่ำเสมอ');
    }

    if (patientData.edema) r.push('มีอาการบวม: หลีกเลี่ยงอาหารเค็มและชั่งน้ำหนักทุกเช้า');
    if (patientData.heartFailure) r.push('มีหัวใจล้มเหลว: จำกัดน้ำเข้มงวดและติดตามอาการหายใจขัด');
    if (patientData.hypertension) r.push('มีความดันโลหิตสูง: จำกัดเกลือให้ต่ำกว่า 2 กรัม/วัน');

    if (patientData.urineOutput > 0 && patientData.urineOutput < 400) {
      r.push('ปัสสาวะน้อย (<400 มล./วัน): ต้องจำกัดน้ำมากขึ้นและติดตามใกล้ชิด');
    }

    r.push('หลีกเลี่ยงผลไม้โปแตสเซียมสูง (เช่น กล้วย มะม่วง ส้ม)');
    r.push('แบ่งดื่มน้ำเป็นครั้งเล็ก ๆ ตลอดวัน ไม่ดื่มครั้งเดียวในปริมาณมาก');

    return r;
  };

  const getDiabetesRecommendations = () => {
    const r: string[] = [];

    if (patientData.hba1c > 10) {
      r.push('HbA1c >10%: ควบคุมน้ำตาลเร่งด่วน และเพิ่มน้ำเพื่อป้องกันภาวะขาดน้ำจาก osmotic diuresis');
      r.push('ติดตามอาการขาดน้ำ เช่น ปากแห้ง เหนื่อยง่าย เวียนศีรษะ');
    } else if (patientData.hba1c > 9) {
      r.push('HbA1c 9–10%: ปรับการรักษา และดื่มน้ำเพิ่มขึ้น ~15%');
    } else if (patientData.hba1c <= 7) {
      r.push('HbA1c ควบคุมดี: ดื่มน้ำ 30–35 มล./กก./วันได้ตามปกติ');
    }

    if (patientData.age > 65) r.push('ผู้สูงอายุ: พิจารณา 25–30 มล./กก./วัน และเฝ้าระวังภาวะขาดน้ำ');

    const { systolic, diastolic } = patientData.bloodPressure;
    if (systolic > 160 || diastolic > 100) r.push('ความดันโลหิตสูงมาก: ควบคุมความดันเร่งด่วน จำกัดเกลือ <2 กรัม/วัน');
    else if (systolic > 140 || diastolic > 90) r.push('ความดันโลหิตสูง: ตั้งเป้า <140/90 mmHg');

    if (patientData.diabeticComplications.nephropathy) {
      r.push('มี diabetic nephropathy: ใช้สูตรจำกัดน้ำแบบ CKD (UOP + 500 มล.)');
      r.push('พิจารณาจำกัดโปรตีน ~0.8 กรัม/กก./วัน และจำกัดเกลือ');
    }
    if (patientData.diabeticComplications.cardiovascular) r.push('มีโรคหัวใจ/หลอดเลือด: จำกัดเกลือและไขมันอิ่มตัว');

    if (patientData.medications.diuretics) r.push('ใช้ยาขับปัสสาวะ: อาจลดปริมาณน้ำลง ~15% และติดตามอาการขาดน้ำ');
    if (patientData.medications.insulin) r.push('ใช้อินซูลิน: ดื่มน้ำเพียงพอ และระวังภาวะน้ำตาลต่ำ (hypoglycemia)');

    r.push('หลีกเลี่ยงเครื่องดื่มหวาน (น้ำอัดลม/น้ำผลไม้หวาน)');
    r.push('ดื่ม “น้ำเปล่า” หรือเครื่องดื่มไม่มีน้ำตาลเป็นหลัก');
    r.push('ตรวจน้ำตาลก่อนอาหารและหลังอาหาร 2 ชม. ตามคำแนะนำแพทย์');

    return r;
  };

  /** ---------- Calculate & risk ---------- */
  const calculateFluidLimit = () => {
    if (!isInputReady()) {
      setResult(null);
      return;
    }

    let fluidLimit = 0;
    let recommendations: string[] = [];

    if (calculationType === 'ckd') {
      fluidLimit = calculateCKDFluidLimit();
      recommendations = getCKDRecommendations();
    } else {
      fluidLimit = calculateDiabetesFluidLimit();
      recommendations = getDiabetesRecommendations();
    }

    let riskLevel: 'low' | 'moderate' | 'high' = 'low';

    if (calculationType === 'ckd') {
      if (
        patientData.ckdStage >= 4 ||
        patientData.heartFailure ||
        (patientData.urineOutput > 0 && patientData.urineOutput < 400)
      ) {
        riskLevel = 'high';
      } else if (patientData.ckdStage === 3 || patientData.edema || (patientData.hypertension && patientData.edema)) {
        riskLevel = 'moderate';
      }
    } else {
      if (
        patientData.hba1c > 10 ||
        patientData.diabeticComplications.nephropathy ||
        (patientData.diabeticComplications.cardiovascular && patientData.hba1c > 9) ||
        patientData.bloodPressure.systolic > 160 ||
        patientData.bloodPressure.diastolic > 100
      ) {
        riskLevel = 'high';
      } else if (
        patientData.hba1c > 9 ||
        patientData.bloodPressure.systolic > 140 ||
        patientData.bloodPressure.diastolic > 90 ||
        patientData.diabeticComplications.cardiovascular ||
        patientData.age > 75
      ) {
        riskLevel = 'moderate';
      }
    }

    setResult({
      dailyFluidLimit: Math.round(fluidLimit),
      recommendations,
      riskLevel,
    });
  };

  useEffect(() => {
    calculateFluidLimit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientData, calculationType]);

  /** ---------- Handlers ---------- */
  const updatePatientData = (field: keyof PatientData, value: any) => {
    setPatientData((prev) => ({ ...prev, [field]: value }));
  };

  type NestedKeys = 'bloodPressure' | 'diabeticComplications' | 'medications';
  const updateNestedData = <P extends NestedKeys, K extends keyof PatientData[P]>(
    parent: P,
    field: K,
    value: PatientData[P][K]
  ) => {
    setPatientData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const resetData = () => setPatientData({ ...defaultPatientData });

  const getRiskColor = (risk: 'low' | 'moderate' | 'high'): Exclude<Tone, 'gray'> => {
    if (risk === 'high') return 'red';
    if (risk === 'moderate') return 'yellow';
    return 'green';
  };

  const getRiskText = (risk: 'low' | 'moderate' | 'high') => {
    if (risk === 'high') return 'ความเสี่ยงสูง';
    if (risk === 'moderate') return 'ความเสี่ยงปานกลาง';
    return 'ความเสี่ยงต่ำ';
  };

  /** ---------- Derived Progress Max (dynamic by weight) ---------- */
  const progressMax = calculationType === 'ckd' ? patientData.weight * 30 : patientData.weight * 35;

  /** ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-300" />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-700" />
        </div>

        <div className="relative px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Droplets className="w-8 h-8 mr-3 text-blue-200" />
              <Calculator className="w-8 h-8 mr-3 text-indigo-200" />
              <h1 className="font-bold text-4xl md:text-5xl text-center">เครื่องคำนวณปริมาณน้ำสำหรับผู้ป่วย</h1>
            </div>
            <p className="text-blue-100 text-lg text-center max-w-3xl mx-auto">
              โรคไตเรื้อรัง และ โรคเบาหวาน — เครื่องมือช่วยวางแผนการดื่มน้ำตามภาวะสุขภาพ
            </p>

            <div className="flex justify-center mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-sm text-blue-200">สำหรับผู้ป่วยไต</div>
                  <div className="text-xl font-bold">30-35 ml/kg</div>
                </div>
                <div className="w-px h-8 bg-white/30" />
                <div className="text-center">
                  <div className="text-sm text-blue-200">สำหรับผู้ป่วยเบาหวาน</div>
                  <div className="text-xl font-bold">30-35 ml/kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Selector */}
        <div className="flex justify-center">
          <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-200">
            <button
              onClick={() => setCalculationType('ckd')}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
                calculationType === 'ckd'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5" />
                <span className="text-lg">ผู้ป่วยโรคไตเรื้อรัง</span>
              </div>
            </button>
            <button
              onClick={() => setCalculationType('diabetes')}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
                calculationType === 'diabetes'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5" />
                <span className="text-lg">ผู้ป่วยโรคเบาหวาน</span>
              </div>
            </button>
          </div>
        </div>

        {/* Reset */}
        <div className="flex justify-center">
          <button
            onClick={resetData}
            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 
                     hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-2xl 
                     transition-all duration-300 font-medium border border-gray-300 
                     hover:border-gray-400 hover:shadow-md transform hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            ล้างข้อมูลทั้งหมด
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Basic */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">ข้อมูลทั่วไป</h2>
                  <p className="text-gray-600 text-sm">ข้อมูลพื้นฐานของผู้ป่วย</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">น้ำหนัก (กก.)</label>
                  <input
                    type="number"
                    value={patientData.weight}
                    onChange={(e) => updatePatientData('weight', toNumber(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-white text-lg"
                    min={20}
                    max={200}
                    placeholder="เช่น 70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">อายุ (ปี)</label>
                  <input
                    type="number"
                    value={patientData.age}
                    onChange={(e) => updatePatientData('age', Math.trunc(toNumber(e.target.value)))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-white text-lg"
                    min={1}
                    max={120}
                    placeholder="เช่น 45"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">เพศ</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-xl transition-all">
                    <input
                      type="radio"
                      checked={patientData.gender === 'male'}
                      onChange={() => updatePatientData('gender', 'male')}
                      className="text-blue-600 w-4 h-4"
                    />
                    <span className="ml-3 font-medium">ชาย</span>
                  </label>
                  <label className="flex items-center cursor-pointer bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-xl transition-all">
                    <input
                      type="radio"
                      checked={patientData.gender === 'female'}
                      onChange={() => updatePatientData('gender', 'female')}
                      className="text-blue-600 w-4 h-4"
                    />
                    <span className="ml-3 font-medium">หญิง</span>
                  </label>
                </div>
              </div>
            </div>

            {/* CKD Inputs */}
            {calculationType === 'ckd' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8 border border-blue-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Droplets className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-blue-800">ข้อมูลโรคไตเรื้อรัง</h2>
                    <p className="text-blue-600 text-sm">ระดับและภาวะแทรกซ้อน</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">ระยะของโรคไตเรื้อรัง (CKD Stage)</label>
                    <select
                      value={patientData.ckdStage || ''}
                      onChange={(e) => updatePatientData('ckdStage', toNumber(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-white text-lg"
                    >
                      <option value="">เลือกระยะของโรค</option>
                      <option value={1}>Stage 1 (GFR ≥ 90)</option>
                      <option value={2}>Stage 2 (GFR 60–89)</option>
                      <option value={3}>Stage 3 (GFR 30–59)</option>
                      <option value={4}>Stage 4 (GFR 15–29)</option>
                      <option value={5}>Stage 5 (GFR &lt; 15)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">ปริมาณปัสสาวะ 24 ชม. (มล.)</label>
                    <input
                      type="number"
                      value={patientData.urineOutput}
                      onChange={(e) => updatePatientData('urineOutput', clamp(toNumber(e.target.value), 0, 5000))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-white text-lg"
                      min={0}
                      max={5000}
                      placeholder="เช่น 1500"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">ภาวะแทรกซ้อน</h3>

                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer bg-white hover:bg-blue-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.edema}
                          onChange={(e) => updatePatientData('edema', e.target.checked)}
                          className="text-blue-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">บวมน้ำ (Edema)</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-blue-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.hypertension}
                          onChange={(e) => updatePatientData('hypertension', e.target.checked)}
                          className="text-blue-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">ความดันโลหิตสูง</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-blue-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.heartFailure}
                          onChange={(e) => updatePatientData('heartFailure', e.target.checked)}
                          className="text-blue-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">หัวใจล้มเหลว</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Diabetes Inputs */}
            {calculationType === 'diabetes' && (
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl shadow-xl p-8 border border-red-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-red-800">ข้อมูลโรคเบาหวาน</h2>
                    <p className="text-red-600 text-sm">ประเภทและภาวะแทรกซ้อน</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">ประเภทเบาหวาน</label>
                      <select
                        value={patientData.diabetesType || ''}
                        onChange={(e) => updatePatientData('diabetesType', toNumber(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white text-lg"
                      >
                        <option value="">เลือกประเภท</option>
                        <option value="1">Type 1</option>
                        <option value="2">Type 2</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">HbA1c (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={patientData.hba1c}
                        onChange={(e) => updatePatientData('hba1c', toNumber(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white text-lg"
                        min={4}
                        max={15}
                        placeholder="เช่น 7.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">ความดันโลหิต Systolic</label>
                      <input
                        type="number"
                        value={patientData.bloodPressure.systolic}
                        onChange={(e) =>
                          updateNestedData(
                            'bloodPressure',
                            'systolic',
                            clamp(Math.trunc(toNumber(e.target.value)), 80, 250)
                          )
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white text-lg"
                        min={80}
                        max={250}
                        placeholder="เช่น 130"
                      />
                    </div>
                    <div>
                      <label className="block text_sm font-medium text-gray-700 mb-3">ความดันโลหิต Diastolic</label>
                      <input
                        type="number"
                        value={patientData.bloodPressure.diastolic}
                        onChange={(e) =>
                          updateNestedData(
                            'bloodPressure',
                            'diastolic',
                            clamp(Math.trunc(toNumber(e.target.value)), 50, 150)
                          )
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white text-lg"
                        min={50}
                        max={150}
                        placeholder="เช่น 80"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">ภาวะแทรกซ้อนจากเบาหวาน</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.nephropathy}
                          onChange={(e) => updateNestedData('diabeticComplications', 'nephropathy', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">ไตเสื่อม</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.retinopathy}
                          onChange={(e) => updateNestedData('diabeticComplications', 'retinopathy', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">จอประสาทตาเสื่อม</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.neuropathy}
                          onChange={(e) => updateNestedData('diabeticComplications', 'neuropathy', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">เส้นประสาทเสื่อม</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.diabeticComplications.cardiovascular}
                          onChange={(e) => updateNestedData('diabeticComplications', 'cardiovascular', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">โรคหัวใจและหลอดเลือด</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">การใช้ยา</h3>

                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.medications.diuretics}
                          onChange={(e) => updateNestedData('medications', 'diuretics', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">ยาขับปัสสาวะ (Diuretics)</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.medications.acei}
                          onChange={(e) => updateNestedData('medications', 'acei', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">ยาลดความดัน ACE Inhibitor</span>
                      </label>

                      <label className="flex items-center cursor-pointer bg-white hover:bg-red-50 p-4 rounded-xl border border-gray-200 transition-all">
                        <input
                          type="checkbox"
                          checked={patientData.medications.insulin}
                          onChange={(e) => updateNestedData('medications', 'insulin', e.target.checked)}
                          className="text-red-600 w-4 h-4"
                        />
                        <span className="ml-3 font-medium">อินซูลิน</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-6">
            {!result ? (
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-3xl shadow-xl p-12 border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">เริ่มต้นการคำนวณ</h3>
                <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                  กรอกข้อมูลพื้นฐานของผู้ป่วยทางด้านซ้ายเพื่อดูผลการคำนวณปริมาณน้ำที่แนะนำ
                </p>
                <div className="space-y-3 text-sm text-gray-500 max-w-lg mx-auto">
                  {calculationType === 'ckd' ? (
                    <>
                      <p>• ข้อมูลที่จำเป็น: น้ำหนัก และ CKD Stage</p>
                      <p>• ข้อมูลเพิ่มเติม: ปริมาณปัสสาวะ และภาวะแทรกซ้อน</p>
                    </>
                  ) : (
                    <>
                      <p>• ข้อมูลที่จำเป็น: น้ำหนัก</p>
                      <p>• ข้อมูลเพิ่มเติม: อายุ, HbA1c, ความดันโลหิต และภาวะแทรกซ้อน</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                        calculationType === 'ckd'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : 'bg-gradient-to-br from-red-500 to-red-600'
                      }`}
                    >
                      <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">ผลการคำนวณ</h2>
                      <p className="text-gray-600">ปริมาณน้ำที่แนะนำต่อวัน</p>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <div
                      className={`text-6xl font-bold mb-3 ${
                        calculationType === 'ckd' ? 'text-blue-600' : 'text-red-600'
                      }`}
                    >
                      {result.dailyFluidLimit.toLocaleString()}
                    </div>
                    <div className="text-xl text-gray-600 mb-2">มิลลิลิตรต่อวัน</div>
                    <div className="text-lg text-gray-500">({(result.dailyFluidLimit / 1000).toFixed(1)} ลิตรต่อวัน)</div>
                  </div>

                  <div className="mb-6">
                    <Progress
                      value={result.dailyFluidLimit}
                      max={progressMax > 0 ? progressMax : calculationType === 'ckd' ? 2000 : 2500}
                      label="เปรียบเทียบกับค่ามาตรฐานตามน้ำหนัก"
                    />
                  </div>

                  <div className="text-center">
                    <Badge tone={getRiskColor(result.riskLevel)}>
                      <div className="flex items-center gap-2">
                        {result.riskLevel === 'low' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        <span className="font-medium">{getRiskText(result.riskLevel)}</span>
                      </div>
                    </Badge>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl shadow-xl p-8 border border-yellow-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-yellow-800">คำแนะนำสำหรับการดูแล</h3>
                      <p className="text-yellow-600 text-sm">แนวทางในการปฏิบัติตัว</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-yellow-200">
                        <span className="text-yellow-600 mt-1 text-lg">•</span>
                        <span className="text-gray-700 leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`rounded-3xl shadow-xl p-8 border ${
                    calculationType === 'ckd'
                      ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                      : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                        calculationType === 'ckd'
                          ? 'bg-gradient-to-br from-red-500 to-red-600'
                          : 'bg-gradient-to-br from-orange-500 to-red-500'
                      }`}
                    >
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-semibold ${
                          calculationType === 'ckd' ? 'text-red-800' : 'text-orange-800'
                        }`}
                      >
                        คำเตือนสำคัญ
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`p-6 bg-white rounded-2xl border ${
                      calculationType === 'ckd' ? 'border-red-200' : 'border-orange-200'
                    }`}
                  >
                    <p className={`${calculationType === 'ckd' ? 'text-red-700' : 'text-orange-700'} text-sm leading-relaxed`}>
                      การคำนวณนี้เป็นเพียงแนวทางเบื้องต้น ควรปรึกษาแพทย์เฉพาะทาง
                      {calculationType === 'ckd' ? 'ไตหรือโภชนากร' : 'เบาหวานหรือโภชนากร'} เพื่อการวางแผนการรักษาที่เหมาะสม
                    </p>
                  </div>
                </div>

                {/* References */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-3xl shadow-xl p-8 border border-gray-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">แหล่งอ้างอิงทางวิชาการ</h3>
                      <p className="text-gray-600 text-sm">เอกสารและแนวทางการรักษา</p>
                    </div>
                  </div>

                  {calculationType === 'ckd' ? (
                    <div className="grid gap-4 text-sm text-gray-700">
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2">แหล่งอ้างอิง:</h4>
                        <p>• KDOQI Clinical Practice Guideline for Nutrition in CKD: 2020 Update</p>
                        <p>• KDIGO (2022) Diabetes Management in CKD</p>
                        <p>• National Kidney Foundation — Fluid Management Guidance</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2">สูตรที่ใช้ (สรุป):</h4>
                        <div className="space-y-1 text-xs">
                          <p>• Stage 1–2: 30–35 ml/kg/day</p>
                          <p>• Stage 3 (มีแทรกซ้อน): UOP + 500 ml</p>
                          <p>• Stage 4–5: UOP + 500–700 ml</p>
                          <p>• Oliguria (&lt;400 ml/day): UOP + 500 ml</p>
                          <p>• ปรับลด: Edema ×0.85, Heart failure ×0.8</p>
                        </div>
                      </div>

                      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <h4 className="font-semibold text-gray-800 mb-4">ตารางสรุปสูตรการคำนวณ (CKD)</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-blue-100">
                                <th className="border border-gray-300 px-2 py-2 text-left">CKD Stage</th>
                                <th className="border border-gray-300 px-2 py-2 text-left">สูตรคำนวณ</th>
                                <th className="border border-gray-300 px-2 py-2 text-left">หมายเหตุ</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-300 px-2 py-2">1–2</td>
                                <td className="border border-gray-300 px-2 py-2">30–35 ml/kg/day</td>
                                <td className="border border-gray-300 px-2 py-2">ยังไม่ต้องจำกัดเข้มงวด</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 px-2 py-2">3</td>
                                <td className="border border-gray-300 px-2 py-2">UOP + 500 ml (ถ้ามีแทรกซ้อน)</td>
                                <td className="border border-gray-300 px-2 py-2">เริ่มเฝ้าระวัง</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 px-2 py-2">4–5</td>
                                <td className="border border-gray-300 px-2 py-2">UOP + 500–700 ml</td>
                                <td className="border border-gray-300 px-2 py-2">จำกัดเข้มงวด</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 text-sm text-gray-700">
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2">แหล่งอ้างอิง:</h4>
                        <p>• American Diabetes Association — Standards of Medical Care in Diabetes</p>
                        <p>• Diabetes Care — แนวทางการจัดการภาวะน้ำ</p>
                        <p>• EASD/ADA Consensus on Type 2 Diabetes Management</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2">สูตรที่ใช้ (สรุป):</h4>
                        <div className="space-y-1 text-xs">
                          <p>• ทั่วไป: 30–35 ml/kg/day</p>
                          <p>• ผู้สูงอายุ (&gt;65 ปี): 25–30 ml/kg/day</p>
                          <p>• HbA1c 9–10%: ×1.15, &gt;10%: ×1.25</p>
                          <p>• HTN &gt;140/90: ×0.95, &gt;160/100: ×0.9</p>
                          <p>• มี Nephropathy: ใช้สูตร CKD (UOP + 500 ml)</p>
                          <p>• ใช้ Diuretics: ×0.85</p>
                        </div>
                      </div>

                      <div className="mt-6 p-6 bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl border border-red-200">
                        <h4 className="font-semibold text-gray-800 mb-4">ตารางสรุปสูตรการคำนวณ (Diabetes)</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-red-100">
                                <th className="border border-gray-300 px-2 py-2 text-left">ภาวะ</th>
                                <th className="border border-gray-300 px-2 py-2 text-left">สูตรคำนวณ</th>
                                <th className="border border-gray-300 px-2 py-2 text-left">หมายเหตุ</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-300 px-2 py-2">DM ทั่วไป</td>
                                <td className="border border-gray-300 px-2 py-2">30–35 ml/kg/day</td>
                                <td className="border border-gray-300 px-2 py-2">หลีกเลี่ยงน้ำหวาน</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 px-2 py-2">ผู้สูงอายุ</td>
                                <td className="border border-gray-300 px-2 py-2">25–30 ml/kg/day</td>
                                <td className="border border-gray-300 px-2 py-2">&gt;65 ปี</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 px-2 py-2">HbA1c &gt;9%</td>
                                <td className="border border-gray-300 px-2 py-2">×1.15–1.25</td>
                                <td className="border border-gray-300 px-2 py-2">กัน dehydration</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 px-2 py-2">DM + CKD</td>
                                <td className="border border-gray-300 px-2 py-2">UOP + 500 ml</td>
                                <td className="border border-gray-300 px-2 py-2">ใช้สูตร CKD</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                    <p className="text-xs text-green-700 leading-relaxed">
                      <strong>หมายเหตุ:</strong> สูตรเป็นแนวทางอิงหลักฐานและปรับให้เหมาะกับผู้ป่วยไทย ใช้ร่วมกับดุลยพินิจแพทย์/โภชนากรเสมอ
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluidCalculator;
