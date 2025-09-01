import React, { useState, useEffect, useMemo } from "react";
import {
  Download,
  FileText,
  RefreshCw,
  Shuffle,
  Settings,
  Star,
  Tag,
  Droplets,
  Sparkles,
  Calendar,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { TagInterface } from "../../interfaces/Tag";
import type { FoodchoiceDiseaseInterface } from "../../interfaces/FoodchoiceDisease";
import type { MealMenuInterface } from "../../interfaces/MealMenu";
import type { DiseasesInterface } from "../../interfaces/Disease";
import type { SlotConfigInterface } from "../../interfaces/SlotConfig";
import type { FoodItemInterface } from "../../interfaces/FoodItem";
import type { MenuInterface } from "../../interfaces/Menu";

import {
  GetFoodChoicesByDiseaseID,
  GetAllDisease,
  GetAllTag,
  GetMenusByTagIDs,
  GetFruits,
  GetDesserts,
  GetDiabeticDesserts,
  GetAllMenu,
} from "../../services/https/index";
import {
  setWithTTL,
  getValidItem,
  clearKey,
  makePlanFingerprint,
} from "../../services/https/ruleUtils";
import MealPlanPDF from "./MealPlanPDF";
import { pdf } from "@react-pdf/renderer";
import saveAs from "file-saver";

/* -------------------------------------------
 *  Utilities: ตัวช่วยอ่าน payload ที่รูปทรงไม่แน่นอน
 * ----------------------------------------- */
const extractArray = <T,>(...candidates: any[]): T[] => {
  for (const c of candidates) if (Array.isArray(c)) return c as T[];
  return [];
};

const extractTags = (resp: any): TagInterface[] =>
  extractArray<TagInterface>(
    resp?.data?.tags,
    resp?.data?.tag, // <— เพิ่ม
    resp?.tags,
    resp?.tag, // <— เพิ่ม
    resp?.data,
    resp
  );

const extractMenus = (resp: any): MenuInterface[] =>
  extractArray<MenuInterface>(
    resp?.data?.menus,
    resp?.menus,
    resp?.data?.menu,
    resp
  );

const extractFruits = (resp: any): FoodItemInterface[] =>
  extractArray<FoodItemInterface>(
    resp?.data?.fooditems,
    resp?.fooditems,
    resp?.data?.fruits,
    resp?.fruits,
    resp
  );

const extractDesserts = (
  resp: any,
  key: "desserts" | "diabeticDesserts"
): MenuInterface[] =>
  extractArray<MenuInterface>(resp?.data?.[key], resp?.[key], resp);

/* -------------------------------------------
 *  Normalizers: บังคับ field ให้ตรงกับ Interface
 * ----------------------------------------- */
const normTag = (t: any): TagInterface => ({
  ID: t?.ID ?? t?.id ?? 0,
  Name: t?.Name ?? t?.name ?? t?.title ?? "",
});

const normMenu = (m: any): MenuInterface => ({
  ...m,
  ID: m?.ID ?? m?.id ?? 0,
  Title: m?.Title ?? m?.title ?? m?.Name ?? m?.name ?? "เมนูไม่มีชื่อ",
});

const normFood = (f: any): FoodItemInterface => ({
  ...f,
  ID: f?.ID ?? f?.id ?? 0,
  Name: f?.Name ?? f?.name ?? f?.Title ?? f?.title ?? "ผลไม้",
});

const normDisease = (d: any): DiseasesInterface => ({
  ID: d?.ID ?? d?.id ?? 0,
  Name: d?.Name ?? d?.name ?? "",
  Stage: d?.Stage ?? d?.stage ?? "",
});

/* -------------------------------------------
 *  Misc utils
 * ----------------------------------------- */
// ====== Local cache keys & TTL ======
const MEAL_PLAN_CACHE_KEY = "mealPlan:v1";
const SLOT_CONFIGS_CACHE_KEY = "slotConfigs:v1";
const SELECTED_DISEASE_ID_KEY = "selectedDiseaseId:v1";
const LAST_RANDOMIZED_KEY = "lastRandomized:v1";
const TTL_MS = 2 * 60 * 60 * 1000; // 2 ชั่วโมง (ปรับได้)
/* const TTL_MS = 5 * 1000; //เอาไว้เทส */
// ====== Cache types ======
type CachedPlan = {
  plan: MealPlan;
  fingerprint: string;
  lastRandomized: number; // epoch ms
};

// ====== Helpers for fingerprint ======
const getSlotTagIdMatrix = (slots: SlotConfigInterface[]) =>
  slots.map((s) =>
    (s.selectedTags || [])
      .map((t) => t?.ID)
      .filter((id): id is number => typeof id === "number")
  );

const currentFingerprint = (diseaseId: number, slots: SlotConfigInterface[]) =>
  makePlanFingerprint(diseaseId, getSlotTagIdMatrix(slots));

const pickOne = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

type DayName =
  | "วันจันทร์"
  | "วันอังคาร"
  | "วันพุธ"
  | "วันพฤหัสบดี"
  | "วันศุกร์"
  | "วันเสาร์"
  | "วันอาทิตย์";

const days: DayName[] = [
  "วันจันทร์",
  "วันอังคาร",
  "วันพุธ",
  "วันพฤหัสบดี",
  "วันศุกร์",
  "วันเสาร์",
  "วันอาทิตย์",
];

/* -------------------------------------------
 *  Types สำหรับแผนมื้ออาหาร
 * ----------------------------------------- */
// มื้อใน 1 วัน
interface DailyMeals {
  เช้า: MealMenuInterface[];
  ว่างเช้า: MealMenuInterface[];
  กลางวัน: MealMenuInterface[];
  ว่างบ่าย: MealMenuInterface[];
  เย็น: MealMenuInterface[];
}

// แผนทั้งสัปดาห์
export type MealPlan = {
  [day: string]: DailyMeals;
};

interface RecommendationData {
  title: string;
  general: string[];
  nutrition: Record<string, string>;
  foods: { แนะนำ: string[]; ควรหลีกเลี่ยง: string[] };
  foodChoices: FoodchoiceDiseaseInterface[];
}

interface BaseRecommendation {
  title: string;
  general: string[];
  nutrition: Record<string, string>;
  foods: { แนะนำ: string[]; ควรหลีกเลี่ยง: string[] };
}

interface BaseRecommendations {
  [key: number]: BaseRecommendation;
}

/* -------------------------------------------
 *  Component
 * ----------------------------------------- */
const MealPlannerApp = () => {
  const navigate = useNavigate();

  /* ---------- State ---------- */
  // (1) เริ่มต้นเป็น "ยังไม่เลือกโรค"
  const [selectedDisease, setSelectedDisease] = useState<DiseasesInterface>({
    ID: 0,
    Name: "",
    Stage: "",
  });

  const [diseases, setDiseases] = useState<DiseasesInterface[]>([]);
  const [allTags, setAllTags] = useState<TagInterface[]>([]);

  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showSlotConfig, setShowSlotConfig] = useState(false);

  const [plannedMeal, setPlannedMeal] = useState<MealPlan | null>(null);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan>({});
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [lastRandomized, setLastRandomized] = useState<Date>(new Date(0)); // (6) default = 0 → แสดง "—"

  const [foodChoiceDiseases, setFoodChoiceDiseases] = useState<
    FoodchoiceDiseaseInterface[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // slot ที่ให้ผู้ใช้เลือกแท็ก (แท็กใช้คัดเมนูเฉพาะมื้อหลัก)
  const [slotConfigs, setSlotConfigs] = useState<SlotConfigInterface[]>([
    { slotName: "มื้อเช้า", selectedTags: [], mealTypes: ["เช้า"] },
    { slotName: "มื้อกลางวัน", selectedTags: [], mealTypes: ["กลางวัน"] },
    { slotName: "มื้อเย็น", selectedTags: [], mealTypes: ["เย็น"] },
  ]);

  // แหล่งข้อมูลสำหรับมื้อว่าง
  const [fruits, setFruits] = useState<FoodItemInterface[]>([]);
  const [desserts, setDesserts] = useState<MenuInterface[]>([]);
  const [diabeticDesserts, setDiabeticDesserts] = useState<MenuInterface[]>([]);

  /* ---------- ปุ่มสุ่ม: พร้อมก็ต่อเมื่อมีแหล่ง snack ที่เหมาะสม ---------- */
  const snackReady = useMemo(() => {
    const hasFruit = fruits.length > 0;
    const hasAnyDessert = desserts.length > 0 || diabeticDesserts.length > 0;
    // ผู้ป่วยเบาหวาน: ต้องมี "ผลไม้" หรือ "ของหวานเบาหวาน" อย่างน้อยหนึ่งอย่าง
    return selectedDisease.ID === 5
      ? hasFruit || diabeticDesserts.length > 0
      : hasFruit || hasAnyDessert;
  }, [
    fruits.length,
    desserts.length,
    diabeticDesserts.length,
    selectedDisease.ID,
  ]);

  /* -------------------------------------------
   *  Data loaders
   * ----------------------------------------- */
  const loadAdditionalData = async () => {
    try {
      const [fruitsRes, dessertsRes, diabeticDessertsRes] = await Promise.all([
        GetFruits(),
        GetDesserts(),
        GetDiabeticDesserts(),
      ]);

      setFruits(extractFruits(fruitsRes).map(normFood));
      setDesserts(extractDesserts(dessertsRes, "desserts").map(normMenu));
      setDiabeticDesserts(
        extractDesserts(diabeticDessertsRes, "diabeticDesserts").map(normMenu)
      );
    } catch (e) {
      console.error("Error loading additional data:", e);
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Diseases
      const diseasesResponse = await GetAllDisease();
      const diseaseArr = extractArray<DiseasesInterface>(
        diseasesResponse?.data?.diseases,
        diseasesResponse?.diseases,
        diseasesResponse?.data,
        diseasesResponse
      ).map(normDisease);

      if (diseaseArr.length) {
        setDiseases(diseaseArr);

        // (2) พยายาม restore; ถ้าไม่มี ให้ "ยังไม่เลือก"
        const savedDiseaseId = getValidItem<number>(SELECTED_DISEASE_ID_KEY);
        if (savedDiseaseId) {
          const found = diseaseArr.find((d) => d.ID === savedDiseaseId);
          setSelectedDisease(found ?? { ID: 0, Name: "", Stage: "" });
        } else {
          setSelectedDisease({ ID: 0, Name: "", Stage: "" });
        }
      } else {
        console.warn("Diseases API returned empty/unknown shape.");
      }

      // Tags
      const tagsResponse = await GetAllTag();
      const rawTags = extractTags(tagsResponse);
      setAllTags(rawTags.map(normTag));

      // restore slotConfigs
      const savedSlots = getValidItem<SlotConfigInterface[]>(
        SLOT_CONFIGS_CACHE_KEY
      );
      if (Array.isArray(savedSlots) && savedSlots.length) {
        setSlotConfigs(savedSlots);
      }
    } catch (err) {
      console.error("Error loading initial data:", err);
      setError("ไม่สามารถโหลดข้อมูลเริ่มต้นได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFoodChoicesByDisease = async (diseaseId: number) => {
    try {
      const resp = await GetFoodChoicesByDiseaseID(diseaseId);
      const items = extractArray<FoodchoiceDiseaseInterface>(
        resp,
        resp?.data,
        resp?.data?.data
      );
      setFoodChoiceDiseases(items);
    } catch (e) {
      console.error("Error loading food choices:", e);
      setFoodChoiceDiseases([]);
    }
  };

  /* -------------------------------------------
   *  Effects
   * ----------------------------------------- */
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadAdditionalData();
  }, []);

  useEffect(() => {
    if (selectedDisease.ID) loadFoodChoicesByDisease(selectedDisease.ID);
  }, [selectedDisease]);

  // (4) restore แผนจาก cache; ถ้าไม่มีหรือ fingerprint ไม่ตรง → รีเซ็ตแผนเป็นว่าง
  useEffect(() => {
    if (!diseases.length) return;
    const fp = currentFingerprint(selectedDisease.ID || 0, slotConfigs);
    const cached = getValidItem<CachedPlan>(MEAL_PLAN_CACHE_KEY);
    if (cached && cached.fingerprint === fp) {
      setCurrentMealPlan(cached.plan);
      setLastRandomized(new Date(cached.lastRandomized || Date.now()));
    } else {
      setCurrentMealPlan({});
      setLastRandomized(new Date(0));
    }
  }, [diseases, slotConfigs, selectedDisease]);

  /* -------------------------------------------
   *  Recommendations
   * ----------------------------------------- */
  const getRecommendations = (): RecommendationData => {
    const baseRecommendations: BaseRecommendations = {
      1: {
        title: "คำแนะนำสำหรับผู้ป่วยโรคไตเรื้อรัง ระยะที่ 1-3a",
        general: [
          "ดื่มน้ำให้เพียงพอ อย่างน้อยวันละ 8-10 แก้ว",
          "จำกัดเกลือในอาหารไม่เกิน 2,300 มิลลิกรัมต่อวัน",
          "รับประทานผลไม้และผัก 5-9 ส่วนต่อวัน",
          "เลือกโปรตีนคุณภาพดี และควบคุมปริมาณ",
          "หลีกเลี่ยงไขมันอิ่มตัวและไขมันทรานส์",
          "ใช้สมุนไพรและเครื่องเทศแทนการปรุงรสด้วยเกลือ",
        ],
        nutrition: {
          โซเดียม: "< 2,300 มก./วัน",
          โปรตีน: "0.8-1.0 กรัม/กก.น้ำหนัก",
          ฟอสฟอรัส: "800-1,000 มก./วัน",
          โพแทสเซียม: "3,500-4,500 มก./วัน",
        },
        foods: {
          แนะนำ: [
            "นมและผลิตภัณฑ์นมไขมันต่ำหรือไร้ไขมัน",
            "เนื้อสัตว์ไม่ติดหนัง ไข่ขาว เต้าหู้",
            "ธัญพืชและผลิตภัณฑ์หลากหลาย",
            "ถั่วต่างๆ อัลมอนด์",
            "น้ำมันชนิดดี เช่น น้ำมันมะกอก",
          ],
          ควรหลีกเลี่ยง: [
            "ไขมันอิ่มตัว ไขมันทรานส์",
            "อาหารที่มีเกลือสูง น้ำปลา ซีอิ๊ว",
            "ขนมหวาน น้ำตาล เครื่องดื่มหวาน",
            "อาหารที่มีฟอสฟอรัสแอบซ่อน",
          ],
        },
      },
      2: {
        title: "คำแนะนำสำหรับผู้ป่วยโรคไตเรื้อรัง ระยะที่ 3b-5",
        general: [
          "ควบคุมความดันโลหิตให้อยู่ในระดับปกติ",
          "จำกัดโซเดียมมากขึ้น ไม่เกิน 2,000 มิลลิกรัมต่อวัน",
          "ลดโปรตีนลง เพื่อลดภาระการทำงานของไต",
          "ระวังโพแทสเซียมและฟอสฟอรัสในอาหาร",
          "ตรวจสุขภาพและติดตามค่าไตเป็นประจำ",
          "หลีกเลี่ยงอาหารที่มีฟอสฟอรัสแอบซ่อนเด็ดขาด",
        ],
        nutrition: {
          โซเดียม: "< 2,000 มก./วัน",
          โปรตีน: "0.6-0.8 กรัม/กก.น้ำหนัก",
          ฟอสฟอรัส: "600-800 มก./วัน",
          โพแทสเซียม: "2,000-3,000 มก./วัน",
        },
        foods: {
          แนะนำ: [
            "น้ำมันชนิดดี",
            "สมุนไพร/เครื่องเทศ",
            "ธัญพืชขัดสี เช่น ข้าวขาว",
          ],
          ควรหลีกเลี่ยง: [
            "นมและผลิตภัณฑ์นม",
            "เนื้อสัตว์มากเกิน",
            "ธัญพืชไม่ขัดสี",
            "ถั่วต่างๆ",
            "ไขมันอิ่มตัว/ทรานส์",
            "เกลือ น้ำปลา ซีอิ๊ว",
            "ขนมหวาน น้ำตาล",
            "อาหารที่มีฟอสฟอรัสแอบซ่อน",
          ],
        },
      },
      3: {
        title: "คำแนะนำสำหรับผู้ป่วยโรคไต HD (Hemodialysis)",
        general: [
          "ควบคุมน้ำตามแพทย์แนะนำ",
          "จำกัดโซเดียมอย่างเคร่งครัด",
          "เพิ่มโปรตีนชดเชยการสูญเสีย",
          "จำกัดโพแทสเซียม/ฟอสฟอรัส",
          "ทานวิตามินตามแพทย์",
          "มาฟอกเลือดตามนัด",
        ],
        nutrition: {
          โซเดียม: "< 2,000 มก./วัน",
          โปรตีน: "1.2-1.4 กรัม/กก.น้ำหนัก",
          ฟอสฟอรัส: "800-1,000 มก./วัน",
          โพแทสเซียม: "2,000-3,000 มก./วัน",
          น้ำ: "500-800 มล./วัน + ปัสสาวะ",
        },
        foods: {
          แนะนำ: [
            "เนื้อสัตว์คุณภาพดี",
            "ไข่ขาว",
            "ข้าวขาว/ขนมปังขาว",
            "น้ำมันมะกอก/คาโนลา",
          ],
          ควรหลีกเลี่ยง: [
            "ผลไม้โพแทสเซียมสูง",
            "ผักใบเขียวเข้ม",
            "นม/ผลิตภัณฑ์นม",
            "ถั่วต่างๆ",
            "เกลือ/เครื่องปรุงเค็ม",
            "อาหารแปรรูป",
            "ดื่มน้ำมากเกิน",
          ],
        },
      },
      4: {
        title: "คำแนะนำสำหรับผู้ป่วยโรคไต CAPD",
        general: [
          "รักษาความสะอาดการทำ CAPD",
          "คุมเกลือ/น้ำ (ผ่อนกว่า HD)",
          "เพิ่มโปรตีน",
          "ระวังติดเชื้อช่องท้อง",
          "ชั่งน้ำหนัก/ดูอาการบวม",
          "ทานเสริมตามแพทย์",
        ],
        nutrition: {
          โซเดียม: "< 2,500 มก./วัน",
          โปรตีน: "1.2-1.3 กรัม/กก.น้ำหนัก",
          ฟอสฟอรัส: "800-1,000 มก./วัน",
          โพแทสเซียม: "2,500-3,500 มก./วัน",
          น้ำ: "1,000-1,500 มล./วัน + ปัสสาวะ",
        },
        foods: {
          แนะนำ: [
            "ปลา/ไก่",
            "ไข่",
            "ข้าวขาว/ขนมปัง",
            "น้ำมันดี",
            "ผักผลไม้เหมาะสม",
          ],
          ควรหลีกเลี่ยง: [
            "อาหารเค็ม",
            "ผลิตภัณฑ์นมมากไป",
            "อาหารแปรรูปมีฟอสฟอรัส",
            "แอลกอฮอล์",
            "ขนมหวานมากไป",
          ],
        },
      },
      5: {
        title: "คำแนะนำสำหรับผู้ป่วยโรคเบาหวาน",
        general: [
          "คุมระดับน้ำตาลตามเป้าหมาย",
          "ทานตรงเวลาและแบ่งมื้อ",
          "เลือกคาร์บ GI ต่ำ",
          "ออกกำลังสม่ำเสมอ",
          "ตรวจน้ำตาลประจำ",
          "คุมน้ำหนัก",
        ],
        nutrition: {
          คาร์โบไฮเดรต: "45-65% พลังงาน",
          โปรตีน: "15-20% พลังงาน",
          ไขมัน: "20-35% พลังงาน",
          เส้นใย: "≥ 25-30 กรัม/วัน",
          โซเดียม: "< 2,300 มก./วัน",
        },
        foods: {
          แนะนำ: [
            "ธัญพืชไม่ขัดสี",
            "ผักไฟเบอร์สูง",
            "ผลไม้สดปริมาณเหมาะสม",
            "ปลา/เนื้อสัตว์ไขมันต่ำ",
            "ถั่วต่างๆ",
            "นมไขมันต่ำ",
            "น้ำมันมะกอก",
          ],
          ควรหลีกเลี่ยง: [
            "น้ำตาล/ขนมหวาน/น้ำหวาน",
            "ข้าว/แป้งขัดสี",
            "ไขมันอิ่มตัว/ทรานส์",
            "ทอด/แปรรูป",
            "แอลกอฮอล์มากไป",
            "ผลไม้กระป๋อง/แห้งหวาน",
          ],
        },
      },
    };

    const diseaseId = selectedDisease.ID || 1;
    const recommendation =
      baseRecommendations[diseaseId] || baseRecommendations[1];
    const shouldShowFoodChoices = diseaseId === 1 || diseaseId === 2;

    return {
      ...recommendation,
      foodChoices: shouldShowFoodChoices ? foodChoiceDiseases : [],
    };
  };

  /* -------------------------------------------
   *  สุ่มแผนมื้ออาหารรายสัปดาห์
   * ----------------------------------------- */
  const handleRandomizePlan = async () => {
    setIsRandomizing(true);
    setError(null);

    try {
      const dessertIdSet = new Set<number>(
        [
          ...desserts.map((d) => d.ID),
          ...diabeticDesserts.map((d) => d.ID),
        ].filter((id): id is number => typeof id === "number")
      );

      const mainPools = await Promise.all(
        slotConfigs.map(async (slot) => {
          const tagIDs = slot.selectedTags
            .map((t) => t.ID)
            .filter((id): id is number => id !== undefined);

          let menusRaw: MenuInterface[] = [];
          let usedAllMenu = false;

          if (tagIDs.length > 0) {
            const resByTags = await GetMenusByTagIDs(tagIDs);
            menusRaw = extractMenus(resByTags).map(normMenu);
            if (menusRaw.length === 0) {
              const resAll = await GetAllMenu();
              menusRaw = extractMenus(resAll).map(normMenu);
              usedAllMenu = true;
            }
          } else {
            const resAll = await GetAllMenu();
            menusRaw = extractMenus(resAll).map(normMenu);
            usedAllMenu = true;
          }

          let menus = menusRaw ?? [];
          if (usedAllMenu) {
            menus = menus.filter((m) => {
              const id = m.ID;
              return !(typeof id === "number" && dessertIdSet.has(id));
            });
          }

          return { slot, menus };
        })
      );

      const emptyMainSlots = mainPools
        .filter((p) => !p.menus?.length)
        .map((p) => p.slot.slotName);
      if (emptyMainSlots.length > 0) {
        throw new Error(
          `ไม่พบเมนูสำหรับ: ${emptyMainSlots.join(
            ", "
          )}\nโปรดเลือกแท็กให้ครอบคลุมมากขึ้น`
        );
      }

      const isDiabetic = selectedDisease.ID === 5;
      const snackDessertPool = isDiabetic ? diabeticDesserts : desserts;

      if (fruits.length === 0 && snackDessertPool.length === 0) {
        throw new Error("ไม่พบตัวเลือกสำหรับมื้อว่างตามเงื่อนไข");
      }

      const resultPlan: MealPlan = {};
      const toMenuTitle = (m: MenuInterface) => m.Title ?? "เมนูไม่มีชื่อ";

      for (const day of days) {
        const daily: DailyMeals = {
          เช้า: [],
          ว่างเช้า: [],
          กลางวัน: [],
          ว่างบ่าย: [],
          เย็น: [],
        };

        /* ----- มื้อหลัก ----- */
        for (const { slot, menus } of mainPools) {
          const chosen = pickOne(menus);
          for (const mealType of slot.mealTypes) {
            if (["เช้า", "กลางวัน", "เย็น"].includes(mealType)) {
              (daily as any)[mealType] = [
                {
                  ID: chosen.ID,
                  PortionText: toMenuTitle(chosen),
                  MenuID: chosen.ID,
                  isFoodItem: false,
                  isSpecialDessert: false,
                },
              ];
            }
          }
        }

        /* ----- มื้อว่าง ----- */
        const isDessertSnack = (item: any) => item && !item.isFoodItem;

        const makeSnackItem = () => {
          const preferFruit = Math.random() < 0.7;
          if (preferFruit && fruits.length > 0) {
            const it = pickOne(fruits);
            return {
              ID: it.ID ?? 0,
              PortionText: it.Name ?? "ผลไม้",
              MenuID: it.ID ?? 0,
              isFoodItem: true,
              isSpecialDessert: false,
            };
          }
          if (snackDessertPool.length > 0) {
            const m = pickOne(snackDessertPool);
            return {
              ID: m.ID ?? 0,
              PortionText: toMenuTitle(m),
              MenuID: m.ID ?? 0,
              isFoodItem: false,
              isSpecialDessert: isDiabetic,
            };
          }
          if (fruits.length > 0) {
            const it = pickOne(fruits);
            return {
              ID: it.ID ?? 0,
              PortionText: it.Name ?? "ผลไม้",
              MenuID: it.ID ?? 0,
              isFoodItem: true,
              isSpecialDessert: false,
            };
          }
          return null;
        };

        const wantMorningSnack = Math.random() < 0.75;
        const wantAfternoonSnack = Math.random() < 0.65;

        let snackMorning = wantMorningSnack ? makeSnackItem() : null;
        let snackAfternoon = wantAfternoonSnack ? makeSnackItem() : null;

        if (isDessertSnack(snackMorning) || isDessertSnack(snackAfternoon)) {
          if (isDessertSnack(snackMorning)) {
            snackAfternoon = null;
          } else {
            snackMorning = null;
          }
        }

        daily["ว่างเช้า"] = snackMorning ? [snackMorning] : [];
        daily["ว่างบ่าย"] = snackAfternoon ? [snackAfternoon] : [];

        resultPlan[day] = daily;
      }
      setPlannedMeal(resultPlan);
      setCurrentMealPlan(resultPlan);
      setLastRandomized(new Date());

      const fp = currentFingerprint(selectedDisease.ID || 0, slotConfigs);
      setWithTTL<CachedPlan>(
        MEAL_PLAN_CACHE_KEY,
        { plan: resultPlan, fingerprint: fp, lastRandomized: Date.now() },
        TTL_MS
      );
      setWithTTL<number>(
        SELECTED_DISEASE_ID_KEY,
        selectedDisease.ID ?? 0,
        TTL_MS
      );
      setWithTTL<SlotConfigInterface[]>(
        SLOT_CONFIGS_CACHE_KEY,
        slotConfigs,
        TTL_MS
      );
      setWithTTL<number>(LAST_RANDOMIZED_KEY, Date.now(), TTL_MS);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "สุ่มแผนไม่สำเร็จ กรุณาลองใหม่หรือลดเงื่อนไขแท็ก"
      );
    } finally {
      setIsRandomizing(false);
    }
  };

  /* -------------------------------------------
   *  Handlers
   * ----------------------------------------- */
  const handleTagToggle = (slotIndex: number, tag: TagInterface) => {
    setSlotConfigs((prev) => {
      const next = prev.map((slot, index) => {
        if (index !== slotIndex) return slot;
        const isSelected = slot.selectedTags.some((t) => t.ID === tag.ID);
        return {
          ...slot,
          selectedTags: isSelected
            ? slot.selectedTags.filter((t) => t.ID !== tag.ID)
            : [...slot.selectedTags, tag],
        };
      });

      clearKey(MEAL_PLAN_CACHE_KEY);
      setWithTTL<SlotConfigInterface[]>(SLOT_CONFIGS_CACHE_KEY, next, TTL_MS);

      return next;
    });
  };

  const getRemainingMinutes = () => {
    const raw = localStorage.getItem(MEAL_PLAN_CACHE_KEY);
    if (!raw) return null;
    try {
      const box = JSON.parse(raw) as { expiresAt?: number };
      if (!box?.expiresAt) return null;
      const diffMs = box.expiresAt - Date.now();
      if (diffMs <= 0) return null;
      return Math.ceil(diffMs / 60000);
    } catch {
      return null;
    }
  };

  const handleGoToFluidCalc = () => navigate("/fluidcalculator");
  // const handleDownload = () => console.log("Downloading meal plan...");

  const handleDownload = async () => {
    if (!plannedMeal) return; // no data to generate PDF
    try {
      const blob = await pdf(<MealPlanPDF mealPlan={plannedMeal} />).toBlob();
      saveAs(blob, "MealPlan.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  const handlePrint = () => window.print();

  /* -------------------------------------------
   *  UI helpers
   * ----------------------------------------- */
  const dayColors: Record<DayName, string> = {
    วันจันทร์: "bg-gradient-to-br from-yellow-100 to-yellow-200",
    วันอังคาร: "bg-gradient-to-br from-pink-100 to-pink-200",
    วันพุธ: "bg-gradient-to-br from-green-100 to-green-200",
    วันพฤหัสบดี: "bg-gradient-to-br from-orange-100 to-orange-200",
    วันศุกร์: "bg-gradient-to-br from-blue-100 to-blue-200",
    วันเสาร์: "bg-gradient-to-br from-purple-100 to-purple-200",
    วันอาทิตย์: "bg-gradient-to-br from-red-100 to-red-200",
  };
  useEffect(() => {
    if (plannedMeal) {
      console.log("Planned Meal updated:", plannedMeal);
    }
  }, [plannedMeal]);
  /* -------------------------------------------
   *  Render
   * ----------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <span className="font-kanit text-xl text-gray-700">
              กำลังโหลดข้อมูล...
            </span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-4">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">!</span>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-kanit font-bold text-red-800">
                  เกิดข้อผิดพลาด
                </h3>
                <p className="font-kanit text-red-700">{error}</p>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  loadInitialData();
                  loadAdditionalData();
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-kanit font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                ลองใหม่
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-6 py-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 mr-3 text-yellow-300 animate-pulse" />
            <h1 className="font-bold text-4xl md:text-5xl font-kanit bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              ระบบวางแผนมื้ออาหารรายสัปดาห์
            </h1>
            <Sparkles className="w-8 h-8 ml-3 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-blue-100 font-kanit text-xl max-w-3xl mx-auto">
            วางแผนอาหารที่เหมาะสมกับระยะโรคและภาวะสุขภาพของคุณ
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Disease select */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 min-w-96 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-500 mr-2" />
              <label className="block text-lg font-kanit font-semibold text-gray-800">
                เลือกระยะโรค
              </label>
            </div>
            <select
              value={selectedDisease.ID || ""} // 0 -> ""
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  // กลับไปยังไม่เลือก
                  setSelectedDisease({ ID: 0, Name: "", Stage: "" });
                  clearKey(SELECTED_DISEASE_ID_KEY);
                  clearKey(MEAL_PLAN_CACHE_KEY);
                  setCurrentMealPlan({});
                  setLastRandomized(new Date(0));
                  return;
                }
                const diseaseId = parseInt(val, 10);
                const disease = diseases.find((d) => d.ID === diseaseId);
                if (disease) {
                  setSelectedDisease(disease);
                  // เปลี่ยนโรค = ล้างแผนเก่า
                  clearKey(MEAL_PLAN_CACHE_KEY);
                  // บันทึก diseaseId ที่เลือกไว้
                  setWithTTL<number>(
                    SELECTED_DISEASE_ID_KEY,
                    disease.ID ?? 0,
                    TTL_MS
                  );
                }
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-kanit text-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
            >
              {/* (3) Placeholder */}
              <option value="">— เลือกระยะโรค —</option>
              {Array.isArray(diseases) &&
                diseases.map((disease) => (
                  <option key={disease.ID} value={disease.ID}>
                    {disease.Name} {disease.Stage}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setShowSlotConfig(!showSlotConfig)}
            className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-kanit text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
            ตั้งค่า Slot การสุ่มเมนู
          </button>

          <button
            onClick={handleGoToFluidCalc}
            className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-kanit text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Droplets className="w-5 h-5" />
            คำนวณ Maintenance Fluid
          </button>
        </div>

        {/* Slot config panel */}
        {showSlotConfig && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100 animate-in fade-in slide-in-from-top duration-500">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-kanit font-bold text-gray-800 mb-2">
                ตั้งค่า Slot การสุ่มเมนูอาหาร
              </h3>
              <p className="text-gray-600 font-kanit">
                กำหนดประเภทอาหารที่ต้องการสำหรับแต่ละมื้อ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {slotConfigs.map((slot, slotIndex) => (
                <div
                  key={slotIndex}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-kanit font-semibold text-gray-800 text-lg">
                        {slot.slotName}
                      </h4>
                      <span className="font-kanit text-sm text-gray-500">
                        ({slot.mealTypes.join(", ")})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {allTags.length === 0 ? (
                      <div className="p-3 rounded-xl border border-dashed border-gray-300 text-gray-500 font-kanit">
                        ยังไม่มีแท็กให้เลือก (กำลังโหลดหรือ API ไม่ส่งข้อมูล)
                      </div>
                    ) : (
                      allTags
                        .filter(
                          (tag) => (tag.Name || "").trim() !== "อาหารหวาน"
                        )
                        .map((tag) => (
                          <label
                            key={tag.ID}
                            className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-white/70 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={slot.selectedTags.some(
                                (t) => t.ID === tag.ID
                              )}
                              onChange={() => handleTagToggle(slotIndex, tag)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-blue-500" />
                              <span className="font-kanit text-gray-700">
                                {tag.Name || `Tag #${tag.ID}`}
                              </span>
                            </div>
                          </label>
                        ))
                    )}
                  </div>

                  {slot.selectedTags.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="font-kanit text-sm text-blue-800 font-medium mb-2">
                        เลือกแล้ว:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {slot.selectedTags.map((t) => (
                          <span
                            key={t.ID}
                            className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-kanit"
                          >
                            {t.Name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <p className="font-kanit text-yellow-800 font-medium mb-1">
                    หมายเหตุ:
                  </p>
                  <p className="font-kanit text-yellow-700 text-sm leading-relaxed">
                    การเลือก tag
                    จะช่วยให้ระบบสุ่มเมนูที่ตรงกับความต้องการของคุณมากขึ้น
                    หากไม่เลือก tag ระบบจะสุ่มจากเมนูทั้งหมดที่เหมาะสมกับโรค
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Randomize button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleRandomizePlan}
            disabled={isRandomizing || !snackReady || !selectedDisease.ID}
            className="group relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-kanit text-xl font-bold shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative flex items-center gap-3">
              {isRandomizing ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  กำลังสุ่มแผนใหม่...
                </>
              ) : (
                <>
                  <Shuffle className="w-6 h-6" />
                  สุ่มแผนอาหารใหม่
                </>
              )}
            </div>
          </button>
        </div>

        {/* Last updated */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="font-kanit text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border">
            สุ่มล่าสุด:{" "}
            {lastRandomized.getTime() === 0
              ? "—"
              : `${lastRandomized.toLocaleDateString(
                  "th-TH"
                )} ${lastRandomized.toLocaleTimeString("th-TH")}`}
          </span>
        </div>

        {/* Meal plan table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-6 px-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-kanit font-bold text-2xl mb-1">
                  {selectedDisease.ID
                    ? `${selectedDisease.Name} ${selectedDisease.Stage}`
                    : "ยังไม่เลือกระยะโรค"}
                </h3>
                <p className="font-kanit text-blue-100">
                  แผนการรับประทานอาหารรายสัปดาห์
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <th className="border border-gray-200 px-6 py-4 font-kanit font-bold text-gray-800">
                    วัน/มื้อ
                  </th>
                  <th className="border border-gray-200 px-6 py-4 bg-gradient-to-br from-purple-100 to-purple-200 font-kanit font-bold text-purple-800">
                    🌅 เช้า
                  </th>
                  <th className="border border-gray-200 px-6 py-4 bg-gradient-to-br from-orange-100 to-orange-200 font-kanit font-bold text-orange-800">
                    ☕ ว่างเช้า
                  </th>
                  <th className="border border-gray-200 px-6 py-4 bg-gradient-to-br from-teal-100 to-teal-200 font-kanit font-bold text-teal-800">
                    🌞 กลางวัน
                  </th>
                  <th className="border border-gray-200 px-6 py-4 bg-gradient-to-br from-orange-100 to-orange-200 font-kanit font-bold text-orange-800">
                    🍎 ว่างบ่าย
                  </th>
                  <th className="border border-gray-200 px-6 py-4 bg-gradient-to-br from-purple-100 to-purple-200 font-kanit font-bold text-purple-800">
                    🌙 เย็น
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentMealPlan).map(([day, meals]) => (
                  <tr
                    key={day}
                    className="hover:bg-blue-50/50 transition-colors duration-200"
                  >
                    <td
                      className={`border border-gray-200 px-6 py-6 font-kanit font-bold text-gray-800 ${
                        dayColors[day as DayName] ?? ""
                      } text-center`}
                    >
                      {day}
                    </td>

                    {/* เช้า */}
                    <td className="border border-gray-200 px-6 py-6">
                      <ul className="space-y-2">
                        {meals?.เช้า?.map((mealMenu) => (
                          <li
                            key={mealMenu.ID}
                            className="flex items-start group"
                          >
                            <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                            <button
                              onClick={() =>
                                navigate(`/menu/${mealMenu.MenuID}`)
                              }
                              className="font-kanit text-gray-700 group-hover:text-purple-700 transition-colors duration-200 text-left hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded px-1"
                            >
                              {mealMenu.PortionText}
                            </button>
                          </li>
                        ))}
                        {(!meals?.เช้า || meals?.เช้า?.length === 0) && (
                          <span className="font-kanit text-gray-400 italic">
                            ไม่มีเมนู
                          </span>
                        )}
                      </ul>
                    </td>

                    {/* ว่างเช้า */}
                    <td className="border border-gray-200 px-6 py-6 bg-gradient-to-br from-orange-50/50 to-yellow-50/50">
                      {meals?.["ว่างเช้า"]?.length ? (
                        <ul className="space-y-2">
                          {meals["ว่างเช้า"].map((mealMenu) => (
                            <li
                              key={mealMenu.ID}
                              className="flex items-start group"
                            >
                              <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                              {mealMenu.isFoodItem ? (
                                <button
                                  onClick={() =>
                                    navigate(`/fooditem/${mealMenu.MenuID}`)
                                  }
                                  className="font-kanit text-gray-700 group-hover:text-green-700 transition-colors duration-200 text-left hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded px-1"
                                >
                                  {mealMenu.PortionText}
                                  <span className="text-xs text-green-600 ml-1">
                                    (ผลไม้)
                                  </span>
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    navigate(`/menu/${mealMenu.MenuID}`)
                                  }
                                  className="font-kanit text-gray-700 group-hover:text-purple-700 transition-colors duration-200 text-left hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded px-1"
                                >
                                  {mealMenu.PortionText}
                                  {mealMenu.isSpecialDessert ? (
                                    <span className="text-xs text-blue-600 ml-1">
                                      (อาหารหวานสำหรับผู้ป่วยเบาหวาน)
                                    </span>
                                  ) : (
                                    <span className="text-xs text-purple-600 ml-1">
                                      (อาหารหวาน)
                                    </span>
                                  )}
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="font-kanit text-gray-400 italic">
                          -
                        </span>
                      )}
                    </td>

                    {/* กลางวัน */}
                    <td className="border border-gray-200 px-6 py-6">
                      <ul className="space-y-2">
                        {meals?.กลางวัน?.map((mealMenu) => (
                          <li
                            key={mealMenu.ID}
                            className="flex items-start group"
                          >
                            <div className="w-3 h-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                            <button
                              onClick={() =>
                                navigate(`/menu/${mealMenu.MenuID}`)
                              }
                              className="font-kanit text-gray-700 group-hover:text-teal-700 transition-colors duration-200 text-left hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 rounded px-1"
                            >
                              {mealMenu.PortionText}
                            </button>
                          </li>
                        ))}
                        {(!meals?.กลางวัน || meals?.กลางวัน?.length === 0) && (
                          <span className="font-kanit text-gray-400 italic">
                            ไม่มีเมนู
                          </span>
                        )}
                      </ul>
                    </td>

                    {/* ว่างบ่าย */}
                    <td className="border border-gray-200 px-6 py-6 bg-gradient-to-br from-orange-50/50 to-yellow-50/50">
                      {meals?.["ว่างบ่าย"]?.length ? (
                        <ul className="space-y-2">
                          {meals["ว่างบ่าย"].map((mealMenu) => (
                            <li
                              key={mealMenu.ID}
                              className="flex items-start group"
                            >
                              <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                              {mealMenu.isFoodItem ? (
                                <button
                                  onClick={() =>
                                    navigate(`/fooditem/${mealMenu.MenuID}`)
                                  }
                                  className="font-kanit text-gray-700 group-hover:text-green-700 transition-colors duration-200 text-left hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded px-1"
                                >
                                  {mealMenu.PortionText}
                                  <span className="text-xs text-green-600 ml-1">
                                    (ผลไม้)
                                  </span>
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    navigate(`/menu/${mealMenu.MenuID}`)
                                  }
                                  className="font-kanit text-gray-700 group-hover:text-purple-700 transition-colors duration-200 text-left hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded px-1"
                                >
                                  {mealMenu.PortionText}
                                  {mealMenu.isSpecialDessert ? (
                                    <span className="text-xs text-blue-600 ml-1">
                                      (อาหารหวานสำหรับผู้ป่วยโรคเบาหวาน)
                                    </span>
                                  ) : (
                                    <span className="text-xs text-purple-600 ml-1">
                                      (อาหารหวาน)
                                    </span>
                                  )}
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="font-kanit text-gray-400 italic">
                          -
                        </span>
                      )}
                    </td>

                    {/* เย็น */}
                    <td className="border border-gray-200 px-6 py-6">
                      <ul className="space-y-2">
                        {meals?.เย็น?.map((mealMenu) => (
                          <li
                            key={mealMenu.ID}
                            className="flex items-start group"
                          >
                            <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                            <button
                              onClick={() =>
                                navigate(`/menu/${mealMenu.MenuID}`)
                              }
                              className="font-kanit text-gray-700 group-hover:text-purple-700 transition-colors duration-200 text-left hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded px-1"
                            >
                              {mealMenu.PortionText}
                            </button>
                          </li>
                        ))}
                        {(!meals?.เย็น || meals?.เย็น?.length === 0) && (
                          <span className="font-kanit text-gray-400 italic">
                            ไม่มีเมนู
                          </span>
                        )}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={handlePrint}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-2xl font-kanit text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FileText className="w-5 h-5" />
            พิมพ์แผนอาหาร
          </button>
          <button
            onClick={handleDownload}
            disabled={!plannedMeal}
            className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-kanit text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            ดาวน์โหลด PDF
          </button>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            disabled={!selectedDisease.ID}
            className={`flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-2xl font-kanit text-lg font-medium shadow-lg transform transition-all duration-300
              ${
                !selectedDisease.ID
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-orange-600 hover:to-red-600 hover:shadow-xl hover:scale-105"
              }
            `}
          >
            <FileText className="w-5 h-5" />
            {showRecommendations ? "ซ่อนคำแนะนำ" : "ดูคำแนะนำโภชนาการ"}
          </button>
        </div>

        {/* Recommendations panel */}
        {showRecommendations && !!selectedDisease.ID && (
          <div className="mt-12 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white py-8 px-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-kanit font-bold text-2xl mb-2">
                  {getRecommendations()?.title}
                </h3>
                <p className="font-kanit text-orange-100">
                  คำแนะนำโภชนาการและการดูแลสุขภาพ
                </p>
              </div>
            </div>

            <div className="p-8">
              {/* General */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">!</span>
                  </div>
                  <h4 className="font-kanit text-xl font-bold text-gray-800">
                    คำแนะนำทั่วไป
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getRecommendations()?.general.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <span className="font-kanit text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <h4 className="font-kanit text-xl font-bold text-gray-800">
                    แนวทางโภชนาการ
                  </h4>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(getRecommendations()?.nutrition || {}).map(
                      ([nutrient, amount]) => (
                        <div
                          key={nutrient}
                          className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <span className="font-kanit font-semibold text-gray-700">
                            {nutrient}:
                          </span>
                          <span className="font-kanit text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full">
                            {amount}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Food choices for CKD stages only */}
              {Array.isArray(getRecommendations()?.foodChoices) &&
                getRecommendations()?.foodChoices.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">F</span>
                      </div>
                      <h4 className="font-kanit text-xl font-bold text-gray-800">
                        คำแนะนำการเลือกอาหาร
                      </h4>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                      <div className="grid grid-cols-1 gap-4">
                        {getRecommendations()?.foodChoices.map((fc, index) => (
                          <div
                            key={index}
                            className="flex items-start p-4 bg-white rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                {fc.FoodChoiceID}
                              </span>
                            </div>
                            <div>
                              <span className="font-kanit font-semibold text-purple-700 block mb-1">
                                {fc.FoodChoice?.FoodName}
                              </span>
                              <span className="font-kanit text-gray-600 text-sm">
                                {fc.Description}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Food lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <h4 className="font-kanit text-xl font-bold text-green-600">
                      อาหารที่แนะนำ
                    </h4>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <ul className="space-y-3">
                      {getRecommendations()?.foods.แนะนำ.map((food, index) => (
                        <li
                          key={index}
                          className="flex items-start p-3 bg-white rounded-xl border border-green-200 hover:shadow-sm transition-all duration-300"
                        >
                          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              ✓
                            </span>
                          </div>
                          <span className="font-kanit text-gray-700">
                            {food}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">✕</span>
                    </div>
                    <h4 className="font-kanit text-xl font-bold text-red-600">
                      อาหารที่ควรหลีกเลี่ยง
                    </h4>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                    <ul className="space-y-3">
                      {getRecommendations()?.foods.ควรหลีกเลี่ยง.map(
                        (food, index) => (
                          <li
                            key={index}
                            className="flex items-start p-3 bg-white rounded-xl border border-red-200 hover:shadow-sm transition-all duration-300"
                          >
                            <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                ✕
                              </span>
                            </div>
                            <span className="font-kanit text-gray-700">
                              {food}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-2xl p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold text-sm">!</span>
                  </div>
                  <div>
                    <p className="font-kanit font-semibold text-yellow-800 mb-2">
                      ข้อควรระวัง
                    </p>
                    <p className="font-kanit text-yellow-700 leading-relaxed">
                      คำแนะนำเหล่านี้เป็นแนวทางทั่วไป
                      ควรปรึกษาแพทย์หรือนักโภชนาการ
                      เพื่อการวางแผนอาหารที่เหมาะสมกับสภาวะสุขภาพของท่านโดยเฉพาะ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlannerApp;
