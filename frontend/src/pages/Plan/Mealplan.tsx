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
  Pin,
  PinOff,
  Search,
  X,
  ChefHat,
  Filter,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import MealPlanPDF from "./MealPlanPDF";

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

/* -------------------------------------------
 * Types & constants
 * ----------------------------------------- */
type SnackType = "ว่างเช้า" | "ว่างบ่าย";
type MainType = "เช้า" | "กลางวัน" | "เย็น";
type MealType = MainType | SnackType;
type PinKey = `${string}-${MealType}`;
type PinnedItems = Record<PinKey, MealMenuInterface>;

const MEAL_PLAN_CACHE_KEY = "mealPlan:v1";
const SLOT_CONFIGS_CACHE_KEY = "slotConfigs:v1";
const SELECTED_DISEASE_ID_KEY = "selectedDiseaseId:v1";
const LAST_RANDOMIZED_KEY = "lastRandomized:v1";
const PINNED_ITEMS_CACHE_KEY = "pinnedItems:v1";
const TTL_MS = 10 * 1000; // demo TTL

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

interface DailyMeals {
  เช้า: MealMenuInterface[];
  "ว่างเช้า": MealMenuInterface[];
  กลางวัน: MealMenuInterface[];
  "ว่างบ่าย": MealMenuInterface[];
  เย็น: MealMenuInterface[];
}
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

type CachedPlan = {
  plan: MealPlan;
  fingerprint: string;
  lastRandomized: number;
};

/* -------------------------------------------
 * Extractors & normalizers
 * ----------------------------------------- */
const extractArray = <T,>(...candidates: any[]): T[] => {
  for (const c of candidates) if (Array.isArray(c)) return c as T[];
  return [];
};
const extractTags = (resp: any): TagInterface[] =>
  extractArray<TagInterface>(
    resp?.data?.tags,
    resp?.data?.tag,
    resp?.tags,
    resp?.tag,
    resp?.data,
    resp
  );
const extractMenus = (resp: any): MenuInterface[] =>
  extractArray<MenuInterface>(resp?.data?.menus, resp?.menus, resp?.data?.menu, resp);
const extractFruits = (resp: any): FoodItemInterface[] =>
  extractArray<FoodItemInterface>(
    resp?.data?.fooditems,
    resp?.fooditems,
    resp?.data?.fruits,
    resp?.fruits,
    resp
  );
const extractDesserts = (resp: any, key: "desserts" | "diabeticDesserts"): MenuInterface[] =>
  extractArray<MenuInterface>(resp?.data?.[key], resp?.[key], resp);

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
 * Helpers
 * ----------------------------------------- */
const makeEmptyDaily = (): DailyMeals => ({
  เช้า: [],
  "ว่างเช้า": [],
  กลางวัน: [],
  "ว่างบ่าย": [],
  เย็น: [],
});
const makeEmptyPlan = (): MealPlan =>
  days.reduce((acc, d) => {
    acc[d] = makeEmptyDaily();
    return acc;
  }, {} as MealPlan);

type QuickPickKind = "menu" | "food" | "dessert";
type QuickPickOption = {
  id: number;
  label: string;
  isFoodItem: boolean;
  isDiabeticDessert?: boolean;
  kind: QuickPickKind;
};
type QuickPickFilter = "all" | "menu" | "food" | "dessert";
type QuickPickState = {
  open: boolean;
  day: string | null;
  mealType: MealType | null;
  options: QuickPickOption[];
  keyword: string;
  filterType: QuickPickFilter;
};

const getSlotTagIdMatrix = (slots: SlotConfigInterface[]) =>
  slots.map((s) =>
    (s.selectedTags || [])
      .map((t) => t?.ID)
      .filter((id): id is number => typeof id === "number")
  );
const currentFingerprint = (diseaseId: number, slots: SlotConfigInterface[]) =>
  makePlanFingerprint(diseaseId, getSlotTagIdMatrix(slots));

const pickOne = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const isDessertSnack = (item: MealMenuInterface | null | undefined) =>
  !!item && !item.isFoodItem;

const toSnackItemFromFruit = (it: FoodItemInterface): MealMenuInterface => ({
  ID: it.ID ?? 0,
  PortionText: it.Name ?? "ผลไม้",
  MenuID: it.ID ?? 0,
  isFoodItem: true,
  isSpecialDessert: false,
});
const toSnackItemFromMenu = (m: MenuInterface, isDiabetic: boolean): MealMenuInterface => ({
  ID: m.ID ?? 0,
  PortionText: m.Title ?? "เมนูไม่มีชื่อ",
  MenuID: m.ID ?? 0,
  isFoodItem: false,
  isSpecialDessert: isDiabetic,
});

const uniqueById = <T extends { ID?: number }>(arr: T[]) => {
  const seen = new Set<number>();
  return arr.filter((x) => {
    const id = (x.ID ?? -1) as number;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};
const mapMenusToOptions = (menus: MenuInterface[]): QuickPickOption[] =>
  menus.map((m) => ({
    id: m.ID!,
    label: m.Title || `เมนู #${m.ID}`,
    isFoodItem: false,
    isDiabeticDessert: false,
    kind: "menu",
  }));

/* ===========================================
 * Component
 * ========================================= */
const MealPlannerApp = () => {
  const navigate = useNavigate();

  // ---------- State ----------
  const [selectedDisease, setSelectedDisease] = useState<DiseasesInterface>({ ID: 0, Name: "", Stage: "" });
  const [diseases, setDiseases] = useState<DiseasesInterface[]>([]);
  const [allTags, setAllTags] = useState<TagInterface[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showSlotConfig, setShowSlotConfig] = useState(false);

  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan>({});
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [lastRandomized, setLastRandomized] = useState<Date>(new Date(0));

  const [pinnedItems, setPinnedItems] = useState<PinnedItems>({});

  const [foodChoiceDiseases, setFoodChoiceDiseases] = useState<FoodchoiceDiseaseInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [slotConfigs, setSlotConfigs] = useState<SlotConfigInterface[]>([
    { slotName: "มื้อเช้า", selectedTags: [], mealTypes: ["เช้า"] },
    { slotName: "มื้อกลางวัน", selectedTags: [], mealTypes: ["กลางวัน"] },
    { slotName: "มื้อเย็น", selectedTags: [], mealTypes: ["เย็น"] },
  ]);

  const [fruits, setFruits] = useState<FoodItemInterface[]>([]);
  const [desserts, setDesserts] = useState<MenuInterface[]>([]);
  const [diabeticDesserts, setDiabeticDesserts] = useState<MenuInterface[]>([]);

  const [quickPick, setQuickPick] = useState<QuickPickState>({
    open: false,
    day: null,
    mealType: null,
    options: [],
    keyword: "",
    filterType: "all",
  });

  // ---------- Derived ----------
  const snackReady = useMemo(() => {
    const hasFruit = fruits.length > 0;
    const hasAnyDessert = desserts.length > 0 || diabeticDesserts.length > 0;
    return selectedDisease.ID === 5 ? hasFruit || diabeticDesserts.length > 0 : hasFruit || hasAnyDessert;
  }, [fruits.length, desserts.length, diabeticDesserts.length, selectedDisease.ID]);

  // ---------- Pin helpers ----------
  const getPinKey = (day: string, mealType: MealType): PinKey => `${day}-${mealType}` as PinKey;
  const isPinned = (day: string, mealType: MealType): boolean => !!pinnedItems[getPinKey(day, mealType)];
  const togglePin = (day: string, mealType: MealType) => {
    const pinKey = getPinKey(day, mealType);
    const currentMeals = currentMealPlan[day]?.[mealType as keyof DailyMeals] || [];
    setPinnedItems((prev) => {
      const next = { ...prev };
      if (next[pinKey]) delete next[pinKey];
      else if (currentMeals.length > 0) next[pinKey] = { ...currentMeals[0] };
      setWithTTL<PinnedItems>(PINNED_ITEMS_CACHE_KEY, next, TTL_MS);
      return next;
    });
  };
  const clearAllPins = () => { setPinnedItems({}); clearKey(PINNED_ITEMS_CACHE_KEY); };
  const clearPinsOnReset = () => { setPinnedItems({}); clearKey(PINNED_ITEMS_CACHE_KEY); };

  // ---------- Data loaders ----------
  const loadAdditionalData = async () => {
    try {
      const [fruitsRes, dessertsRes, diabeticDessertsRes] = await Promise.all([
        GetFruits(),
        GetDesserts(),
        GetDiabeticDesserts(),
      ]);
      setFruits(extractFruits(fruitsRes).map(normFood));
      setDesserts(extractDesserts(dessertsRes, "desserts").map(normMenu));
      setDiabeticDesserts(extractDesserts(diabeticDessertsRes, "diabeticDesserts").map(normMenu));
    } catch (e) { console.error("Error loading additional data:", e); }
  };
  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const diseasesResponse = await GetAllDisease();
      const diseaseArr = extractArray<DiseasesInterface>(
        diseasesResponse?.data?.diseases,
        diseasesResponse?.diseases,
        diseasesResponse?.data,
        diseasesResponse
      ).map(normDisease);
      if (diseaseArr.length) {
        setDiseases(diseaseArr);
        const savedDiseaseId = getValidItem<number>(SELECTED_DISEASE_ID_KEY);
        setSelectedDisease(savedDiseaseId ? diseaseArr.find((d) => d.ID === savedDiseaseId) ?? { ID: 0, Name: "", Stage: "" } : { ID: 0, Name: "", Stage: "" });
      }

      const tagsResponse = await GetAllTag();
      setAllTags(extractTags(tagsResponse).map(normTag));

      const savedSlots = getValidItem<SlotConfigInterface[]>(SLOT_CONFIGS_CACHE_KEY);
      if (Array.isArray(savedSlots) && savedSlots.length) setSlotConfigs(savedSlots);

      const savedPinned = getValidItem<PinnedItems>(PINNED_ITEMS_CACHE_KEY);
      if (savedPinned) setPinnedItems(savedPinned);
    } catch (err) {
      console.error("Error loading initial data:", err);
      setError("ไม่สามารถโหลดข้อมูลเริ่มต้นได้ กรุณาลองใหม่อีกครั้ง");
    } finally { setIsLoading(false); }
  };
  const loadFoodChoicesByDisease = async (diseaseId: number) => {
    try {
      const resp = await GetFoodChoicesByDiseaseID(diseaseId);
      const items = extractArray<FoodchoiceDiseaseInterface>(resp, resp?.data, resp?.data?.data);
      setFoodChoiceDiseases(items);
    } catch { setFoodChoiceDiseases([]); }
  };

  // ---------- Effects ----------
  useEffect(() => { loadInitialData(); }, []);
  useEffect(() => { loadAdditionalData(); }, []);
  useEffect(() => { if (selectedDisease.ID) loadFoodChoicesByDisease(selectedDisease.ID); }, [selectedDisease]);

  useEffect(() => {
    if (!diseases.length) return;
    const fp = currentFingerprint(selectedDisease.ID || 0, slotConfigs);
    const cached = getValidItem<CachedPlan>(MEAL_PLAN_CACHE_KEY);
    if (cached && cached.fingerprint === fp) {
      setCurrentMealPlan(cached.plan);
      setLastRandomized(new Date(cached.lastRandomized || Date.now()));
      const savedPinned = getValidItem<PinnedItems>(PINNED_ITEMS_CACHE_KEY);
      setPinnedItems(savedPinned || {});
    } else {
      setCurrentMealPlan(selectedDisease.ID ? makeEmptyPlan() : {});
      setLastRandomized(new Date(0));
      clearPinsOnReset();
    }
  }, [diseases, slotConfigs, selectedDisease]);

  // Close QuickPick on ESC
  useEffect(() => {
    if (!quickPick.open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeQuickPick();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickPick.open]);

  // ---------- Recommendations ----------
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
        nutrition: { โซเดียม: "< 2,300 มก./วัน", โปรตีน: "0.8-1.0 กรัม/กก.น้ำหนัก", ฟอสฟอรัส: "800-1,000 มก./วัน", โพแทสเซียม: "3,500-4,500 มก./วัน" },
        foods: { แนะนำ: ["นมไขมันต่ำ", "เนื้อไม่ติดหนัง/ไข่ขาว/เต้าหู้", "ธัญพืช", "ถั่ว/อัลมอนด์", "น้ำมันดี"], ควรหลีกเลี่ยง: ["ไขมันอิ่มตัว/ทรานส์", "อาหารเค็มจัด", "น้ำตาล/เครื่องดื่มหวาน", "ฟอสฟอรัสแฝง"] },
      },
      2: {
        title: "คำแนะนำสำหรับผู้ป่วยโรคไตเรื้อรัง ระยะที่ 3b-5",
        general: ["คุมความดันให้อยู่ในเกณฑ์", "โซเดียมไม่เกิน 2,000 มก./วัน", "ลดโปรตีน", "ระวังโพแทสเซียม/ฟอสฟอรัส", "ติดตามค่าไตสม่ำเสมอ", "หลีกเลี่ยงฟอสฟอรัสแฝง"],
        nutrition: { โซเดียม: "< 2,000 มก./วัน", โปรตีน: "0.6-0.8 กรัม/กก.", ฟอสฟอรัส: "600-800 มก./วัน", โพแทสเซียม: "2,000-3,000 มก./วัน" },
        foods: { แนะนำ: ["น้ำมันดี", "สมุนไพร/เครื่องเทศ", "ข้าวขาว"], ควรหลีกเลี่ยง: ["นม", "เนื้อสัตว์มากเกิน", "ธัญพืชไม่ขัดสี", "ถั่ว", "อาหารแปรรูปเค็ม"] },
      },
      3: {
        title: "คำแนะนำสำหรับผู้ป่วยไต HD",
        general: ["คุมน้ำตามแพทย์", "จำกัดโซเดียมเข้มงวด", "เพิ่มโปรตีน", "จำกัด K/P", "ทานวิตามิน", "ฟอกเลือดตามนัด"],
        nutrition: { โซเดียม: "< 2,000 มก./วัน", โปรตีน: "1.2-1.4 กรัม/กก.", ฟอสฟอรัส: "800-1,000 มก./วัน", โพแทสเซียม: "2,000-3,000 มก./วัน", น้ำ: "500-800 มล./วัน + ปัสสาวะ" },
        foods: { แนะนำ: ["โปรตีนดี", "ไข่ขาว", "ข้าวขาว", "น้ำมันดี"], ควรหลีกเลี่ยง: ["ผลไม้ K สูง", "นม", "ถั่ว", "อาหารแปรรูป"] },
      },
      4: {
        title: "คำแนะนำสำหรับผู้ป่วย CAPD",
        general: ["รักษาความสะอาด", "คุมเกลือ/น้ำ", "เพิ่มโปรตีน", "เฝ้าระวังติดเชื้อ", "ชั่งน้ำหนัก", "เสริมตามแพทย์"],
        nutrition: { โซเดียม: "< 2,500 มก./วัน", โปรตีน: "1.2-1.3 กรัม/กก.", ฟอสฟอรัส: "800-1,000 มก./วัน", โพแทสเซียม: "2,500-3,500 มก./วัน", น้ำ: "1,000-1,500 มล./วัน + ปัสสาวะ" },
        foods: { แนะนำ: ["ปลา/ไก่", "ไข่", "ข้าว/ขนมปัง", "น้ำมันดี"], ควรหลีกเลี่ยง: ["อาหารเค็ม", "แปรรูป", "แอลกอฮอล์"] },
      },
      5: {
        title: "คำแนะนำสำหรับผู้ป่วยเบาหวาน",
        general: ["คุมน้ำตาลตามเป้า", "ทานตรงเวลา/แบ่งมื้อ", "เลือกคาร์บ GI ต่ำ", "ออกกำลัง", "ตรวจน้ำตาล", "คุมน้ำหนัก"],
        nutrition: { คาร์บ: "45-65% พลังงาน", โปรตีน: "15-20% พลังงาน", ไขมัน: "20-35% พลังงาน", เส้นใย: "≥ 25-30 กรัม/วัน", โซเดียม: "< 2,300 มก./วัน" },
        foods: { แนะนำ: ["ธัญพืชไม่ขัดสี", "ผัก", "ปลา/เนื้อไม่ติดมัน", "ถั่ว", "นมไขมันต่ำ"], ควรหลีกเลี่ยง: ["น้ำตาล/ของหวาน", "แป้งขัดสี", "ทอด/แปรรูป", "แอลกอฮอล์มากไป"] },
      },
    };

    const diseaseId = selectedDisease.ID || 1;
    const recommendation = baseRecommendations[diseaseId] || baseRecommendations[1];
    const shouldShowFoodChoices = diseaseId === 1 || diseaseId === 2;

    return { ...recommendation, foodChoices: shouldShowFoodChoices ? foodChoiceDiseases : [] };
  };

  // ---------- Randomize ----------
  const handleRandomizePlan = async () => {
    setIsRandomizing(true);
    setError(null);
    try {
      const dessertIdSet = new Set<number>([...desserts, ...diabeticDesserts].map((d) => d.ID).filter((id): id is number => typeof id === "number"));

      const mainPools = await Promise.all(
        slotConfigs.map(async (slot) => {
          const tagIDs = slot.selectedTags.map((t) => t.ID).filter((id): id is number => id !== undefined);
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
          if (usedAllMenu) menus = menus.filter((m) => !(typeof m.ID === "number" && dessertIdSet.has(m.ID)));
          return { slot, menus };
        })
      );

      const emptyMain = mainPools.filter((p) => !p.menus?.length).map((p) => p.slot.slotName);
      if (emptyMain.length > 0) throw new Error(`ไม่พบเมนูสำหรับ: ${emptyMain.join(", ")}\nโปรดเลือกแท็กให้ครอบคลุมมากขึ้น`);

      const isDiabetic = selectedDisease.ID === 5;
      const snackDessertPool = isDiabetic ? diabeticDesserts : desserts;
      if (fruits.length === 0 && snackDessertPool.length === 0) throw new Error("ไม่พบตัวเลือกสำหรับมื้อว่างตามเงื่อนไข");

      const resultPlan: MealPlan = JSON.parse(JSON.stringify(currentMealPlan));
      const makeSnackItem = (): MealMenuInterface | null => {
        const preferFruit = Math.random() < 0.7;
        if (preferFruit && fruits.length > 0) return toSnackItemFromFruit(pickOne(fruits));
        if (snackDessertPool.length > 0) return toSnackItemFromMenu(pickOne(snackDessertPool), isDiabetic);
        if (fruits.length > 0) return toSnackItemFromFruit(pickOne(fruits));
        return null;
      };

      for (const day of days) {
        const daily: DailyMeals = resultPlan[day] ?? makeEmptyDaily();

        // มื้อหลัก
        for (const { slot, menus } of mainPools) {
          for (const mealType of slot.mealTypes) {
            if (["เช้า", "กลางวัน", "เย็น"].includes(mealType)) {
              const pinKey = getPinKey(day, mealType as MealType);
              const pinned = pinnedItems[pinKey];
              if (pinned) (daily as any)[mealType] = [{ ...pinned }];
              else {
                const chosen = pickOne(menus);
                (daily as any)[mealType] = [{ ID: chosen.ID, PortionText: chosen.Title ?? "เมนูไม่มีชื่อ", MenuID: chosen.ID, isFoodItem: false, isSpecialDessert: false }];
              }
            }
          }
        }

        // มื้อว่าง
        const morningSnackKey = getPinKey(day, "ว่างเช้า");
        const afternoonSnackKey = getPinKey(day, "ว่างบ่าย");
        const pinnedMorning = pinnedItems[morningSnackKey] || null;
        const pinnedAfternoon = pinnedItems[afternoonSnackKey] || null;

        let snackMorning: MealMenuInterface | null = pinnedMorning ? { ...pinnedMorning } : null;
        let snackAfternoon: MealMenuInterface | null = pinnedAfternoon ? { ...pinnedAfternoon } : null;

        if (!pinnedMorning) snackMorning = Math.random() < 0.75 ? makeSnackItem() : null;
        if (!pinnedAfternoon) snackAfternoon = Math.random() < 0.65 ? makeSnackItem() : null;

        // mutual exclusion ของหวาน
        const pinnedMorningIsDessert = pinnedMorning && isDessertSnack(pinnedMorning);
        const pinnedAfternoonIsDessert = pinnedAfternoon && isDessertSnack(pinnedAfternoon);
        if (pinnedMorningIsDessert) snackAfternoon = null;
        if (pinnedAfternoonIsDessert) snackMorning = null;
        if (pinnedMorningIsDessert && pinnedAfternoonIsDessert) Math.random() < 0.5 ? (snackAfternoon = null) : (snackMorning = null);

        const morningIsDessert = isDessertSnack(snackMorning);
        const afternoonIsDessert = isDessertSnack(snackAfternoon);
        if (morningIsDessert) {
          const afternoonIsPinnedFruit = !!(pinnedAfternoon && pinnedAfternoon.isFoodItem);
          if (!afternoonIsPinnedFruit) snackAfternoon = null;
          else snackMorning = null;
        }
        if (afternoonIsDessert) {
          const morningIsPinnedFruit = !!(pinnedMorning && pinnedMorning.isFoodItem);
          if (!morningIsPinnedFruit) snackMorning = null;
          else snackAfternoon = null;
        }

        daily["ว่างเช้า"] = snackMorning ? [snackMorning] : [];
        daily["ว่างบ่าย"] = snackAfternoon ? [snackAfternoon] : [];
        resultPlan[day] = daily;
      }

      setCurrentMealPlan(resultPlan);
      setLastRandomized(new Date());

      const fp = currentFingerprint(selectedDisease.ID || 0, slotConfigs);
      setWithTTL<CachedPlan>(MEAL_PLAN_CACHE_KEY, { plan: resultPlan, fingerprint: fp, lastRandomized: Date.now() }, TTL_MS);
      setWithTTL<number>(SELECTED_DISEASE_ID_KEY, selectedDisease.ID ?? 0, TTL_MS);
      setWithTTL<SlotConfigInterface[]>(SLOT_CONFIGS_CACHE_KEY, slotConfigs, TTL_MS);
      setWithTTL<number>(LAST_RANDOMIZED_KEY, Date.now(), TTL_MS);
      setWithTTL<PinnedItems>(PINNED_ITEMS_CACHE_KEY, pinnedItems, TTL_MS);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "สุ่มแผนไม่สำเร็จ กรุณาลองใหม่หรือลดเงื่อนไขแท็ก");
    } finally { setIsRandomizing(false); }
  };

  // ---------- QuickPick ----------
  const buildQuickPickOptions = async (mealType: MealType): Promise<QuickPickOption[]> => {
    if (["เช้า", "กลางวัน", "เย็น"].includes(mealType)) {
      const slot = slotConfigs.find((s) => s.mealTypes.includes(mealType as MainType));
      const tagIDs = slot?.selectedTags?.map((t) => t.ID).filter((id): id is number => typeof id === "number") ?? [];

      const dessertIdSet = new Set<number>([...desserts, ...diabeticDesserts].map((d) => d.ID).filter((id): id is number => typeof id === "number"));
      let pool: MenuInterface[] = [];
      if (tagIDs.length > 0) {
        try {
          const res = await GetMenusByTagIDs(tagIDs);
          pool = extractMenus(res).map(normMenu);
        } catch { pool = []; }
      }
      if (!tagIDs.length || pool.length === 0) {
        const allRes = await GetAllMenu();
        pool = extractMenus(allRes).map(normMenu);
      }
      const cleaned = uniqueById(pool.filter((m) => !dessertIdSet.has((m.ID ?? -1) as number)));
      return mapMenusToOptions(cleaned);
    }

    const isDiabetic = selectedDisease.ID === 5;
    const dessertPool = isDiabetic ? diabeticDesserts : desserts;
    return [
      ...fruits.map((f) => ({ id: f.ID!, label: f.Name || `ผลไม้ #${f.ID}`, isFoodItem: true, isDiabeticDessert: false, kind: "food" as const })),
      ...dessertPool.map((m) => ({ id: m.ID!, label: m.Title || `ของหวาน #${m.ID}`, isFoodItem: false, isDiabeticDessert: isDiabetic, kind: "dessert" as const })),
    ];
  };

  const openQuickPick = async (day: string, mealType: MealType) => {
    try {
      const options = await buildQuickPickOptions(mealType);
      setQuickPick({ open: true, day, mealType, options, keyword: "", filterType: "all" });
    } catch { setError("ไม่สามารถโหลดรายการให้เลือกได้"); }
  };
  const closeQuickPick = () => setQuickPick((s) => ({ ...s, open: false }));

  const filteredOptions = useMemo(() => {
    const kw = quickPick.keyword.trim().toLowerCase();
    return quickPick.options.filter((o) => {
      const passKw = !kw || o.label.toLowerCase().includes(kw);
      const passFilter = quickPick.filterType === "all" ? true : quickPick.filterType === o.kind;
      return passKw && passFilter;
    });
  }, [quickPick.options, quickPick.keyword, quickPick.filterType]);

  const chooseManualForCell = (opt: QuickPickOption) => {
    if (!quickPick.day || !quickPick.mealType) return;
    const day = quickPick.day!;
    const mealType = quickPick.mealType!;
    const pinKey = getPinKey(day, mealType);

    const item: MealMenuInterface = opt.isFoodItem
      ? toSnackItemFromFruit({ ID: opt.id, Name: opt.label } as any)
      : toSnackItemFromMenu({ ID: opt.id, Title: opt.label } as any, !!opt.isDiabeticDessert);

    setCurrentMealPlan((prev) => {
      const copy = { ...prev };
      const daily = copy[day] ?? makeEmptyDaily();
      (daily as any)[mealType] = [{ ...item }];
      copy[day] = daily;
      return copy;
    });

    setPinnedItems((prev) => {
      const next = { ...prev, [pinKey]: { ...item } };
      setWithTTL<PinnedItems>(PINNED_ITEMS_CACHE_KEY, next, TTL_MS);
      return next;
    });

    if (mealType === "ว่างเช้า" || mealType === "ว่างบ่าย") {
      const isDessert = isDessertSnack(item);
      const oppositeType: MealType = mealType === "ว่างเช้า" ? "ว่างบ่าย" : "ว่างเช้า";
      if (isDessert) {
        const oppositePin = pinnedItems[getPinKey(day, oppositeType)];
        const oppositeIsPinnedFruit = !!(oppositePin && oppositePin.isFoodItem);
        if (!oppositeIsPinnedFruit) {
          setCurrentMealPlan((prev) => {
            const copy = { ...prev };
            const daily = copy[day] ?? makeEmptyDaily();
            (daily as any)[oppositeType] = [];
            copy[day] = daily;
            return copy;
          });
          if (oppositePin && !oppositePin.isFoodItem) {
            setPinnedItems((prev) => {
              const next = { ...prev };
              delete next[getPinKey(day, oppositeType)];
              setWithTTL<PinnedItems>(PINNED_ITEMS_CACHE_KEY, next, TTL_MS);
              return next;
            });
          }
        }
      }
    }

    closeQuickPick();
  };

  // ---------- Misc ----------
  const handleTagToggle = (slotIndex: number, tag: TagInterface) => {
    setSlotConfigs((prev) => {
      const next = prev.map((slot, index) => {
        if (index !== slotIndex) return slot;
        const isSelected = slot.selectedTags.some((t) => t.ID === tag.ID);
        return { ...slot, selectedTags: isSelected ? slot.selectedTags.filter((t) => t.ID !== tag.ID) : [...slot.selectedTags, tag] };
      });
      clearKey(MEAL_PLAN_CACHE_KEY);
      setWithTTL<SlotConfigInterface[]>(SLOT_CONFIGS_CACHE_KEY, next, TTL_MS);
      return next;
    });
  };

  const handleGoToFluidCalc = () => navigate("/fluidcalculator");
  const diseaseTitle = selectedDisease.ID ? `${selectedDisease.Name} ${selectedDisease.Stage || ""}`.trim() : "ยังไม่เลือกระยะโรค";
  const rec = getRecommendations();

  const isPlanReady = useMemo(() => {
    const d = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];
    const s = ["เช้า", "ว่างเช้า", "กลางวัน", "ว่างบ่าย", "เย็น"];
    if (!currentMealPlan) return false;
    return d.every((day) => {
      const daily = (currentMealPlan as any)[day];
      return daily && s.every((slot) => daily[slot] !== undefined);
    });
  }, [currentMealPlan]);

  const buildPdfPayload = () => ({
    mealPlan: currentMealPlan,
    diseaseTitle,
    generatedAt: new Date(),
    recommendations: getRecommendations?.(),
  });

  const handleDownload = async () => {
    try {
      const element = <MealPlanPDF {...buildPdfPayload()} />;
      const blob = await pdf(element).toBlob();
      saveAs(blob, `MealPlan_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.pdf`);
    } catch { setError?.("สร้าง PDF ไม่สำเร็จ"); }
  };

  const handlePrint = async () => {
    try {
      const element = <MealPlanPDF {...buildPdfPayload()} />;
      const blob = await pdf(element).toBlob();
      const url = URL.createObjectURL(blob);
      const win = window.open(url);
      setTimeout(() => { try { win?.focus(); win?.print(); } catch { } }, 600);
    } catch { setError?.("สร้าง PDF ไม่สำเร็จ"); }
  };

  // ---------- UI helpers ----------
  const dayColors: Record<DayName, string> = {
    วันจันทร์: "bg-gradient-to-br from-yellow-100 to-yellow-200",
    วันอังคาร: "bg-gradient-to-br from-pink-100 to-pink-200",
    วันพุธ: "bg-gradient-to-br from-green-100 to-green-200",
    วันพฤหัสบดี: "bg-gradient-to-br from-orange-100 to-orange-200",
    วันศุกร์: "bg-gradient-to-br from-blue-100 to-blue-200",
    วันเสาร์: "bg-gradient-to-br from-purple-100 to-purple-200",
    วันอาทิตย์: "bg-gradient-to-br from-red-100 to-red-200",
  };

  const pinCount = Object.keys(pinnedItems).length;

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <span className="font-kanit text-xl text-gray-700">กำลังโหลดข้อมูล...</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
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
                <h3 className="font-kanit font-bold text-red-800">เกิดข้อผิดพลาด</h3>
                <p className="font-kanit text-red-700">{error}</p>
              </div>
              <button
                onClick={() => { setError(null); loadInitialData(); loadAdditionalData(); }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-kanit font-medium shadow-lg"
              >
                ลองใหม่
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="relative px-6 py-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 mr-3 text-yellow-300" />
            <h1 className="font-bold text-4xl md:text-5xl font-kanit bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              ระบบวางแผนมื้ออาหารรายสัปดาห์
            </h1>
            <Sparkles className="w-8 h-8 ml-3 text-yellow-300" />
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
          <div className="bg-white rounded-3xl shadow-xl p-8 min-w-96 border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-500 mr-2" />
              <label className="block text-lg font-kanit font-semibold text-gray-800">เลือกระยะโรค</label>
            </div>
            <select
              value={selectedDisease.ID || ""}
              onChange={(e) => {
                const val = e.target.value;
                const DEFAULT_SLOTS: SlotConfigInterface[] = [
                  { slotName: "มื้อเช้า", selectedTags: [], mealTypes: ["เช้า"] },
                  { slotName: "มื้อกลางวัน", selectedTags: [], mealTypes: ["กลางวัน"] },
                  { slotName: "มื้อเย็น", selectedTags: [], mealTypes: ["เย็น"] },
                ];
                if (val === "") {
                  setSelectedDisease({ ID: 0, Name: "", Stage: "" });
                  clearKey(SELECTED_DISEASE_ID_KEY);
                  clearKey(MEAL_PLAN_CACHE_KEY);
                  setCurrentMealPlan({});
                  setLastRandomized(new Date(0));
                  clearPinsOnReset();
                  setShowSlotConfig(false);
                  setSlotConfigs(DEFAULT_SLOTS);
                  clearKey(SLOT_CONFIGS_CACHE_KEY);
                  return;
                }
                const diseaseId = parseInt(val, 10);
                const disease = diseases.find((d) => d.ID === diseaseId);
                if (disease) {
                  setSelectedDisease(disease);
                  clearKey(MEAL_PLAN_CACHE_KEY);
                  clearPinsOnReset();
                  setShowSlotConfig(false);
                  setSlotConfigs(DEFAULT_SLOTS);
                  clearKey(SLOT_CONFIGS_CACHE_KEY);
                  setWithTTL<number>(SELECTED_DISEASE_ID_KEY, disease.ID ?? 0, TTL_MS);
                  setCurrentMealPlan(makeEmptyPlan());
                  setLastRandomized(new Date(0));
                }
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-kanit text-lg bg-gradient-to-r from-gray-50 to-blue-50"
            >
              <option value="">— เลือกระยะโรค —</option>
              {diseases.map((disease) => (
                <option key={disease.ID} value={disease.ID}>
                  {disease.Name} {disease.Stage}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions top */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => selectedDisease.ID && setShowSlotConfig((s) => !s)}
            disabled={!selectedDisease.ID}
            className={`flex items-center gap-3 text-white px-8 py-4 rounded-2xl font-kanit text-lg font-medium shadow-lg ${!selectedDisease.ID ? "bg-indigo-300 opacity-50 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              }`}
          >
            <Settings className="w-5 h-5" />
            ตั้งค่า Slot การสุ่มเมนู
          </button>

          <button
            onClick={handleGoToFluidCalc}
            className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-8 py-4 rounded-2xl font-kanit text-lg font-medium shadow-lg"
          >
            <Droplets className="w-5 h-5" />
            คำนวณ Maintenance Fluid
          </button>

          {pinCount > 0 && (
            <button
              onClick={clearAllPins}
              className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-2xl font-kanit text-lg font-medium shadow-lg"
            >
              <PinOff className="w-5 h-5" />
              ล้างปักหมุดทั้งหมด ({pinCount})
            </button>
          )}
        </div>

        {/* Slot config */}
        {showSlotConfig && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-kanit font-bold text-gray-800 mb-2">ตั้งค่า Slot การสุ่มเมนูอาหาร</h3>
              <p className="text-gray-600 font-kanit">กำหนดประเภทอาหารที่ต้องการสำหรับแต่ละมื้อ (ใช้คัดเมนูมื้อหลัก)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {slotConfigs.map((slot, slotIndex) => (
                <div key={slotIndex} className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-kanit font-semibold text-gray-800 text-lg">{slot.slotName}</h4>
                      <span className="font-kanit text-sm text-gray-500">({slot.mealTypes.join(", ")})</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {allTags.length === 0 ? (
                      <div className="p-3 rounded-xl border border-dashed border-gray-300 text-gray-500 font-kanit">ยังไม่มีแท็กให้เลือก</div>
                    ) : (
                      allTags
                        .filter(
                          (tag) =>
                            (tag.Name || "").trim() !== "อาหารหวาน" &&
                            (tag.Name || "").trim() !== "อาหารหวานสำหรับผู้ป่วยโรคเบาหวาน"
                        )
                        .map((tag) => (
                          <label key={tag.ID} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-white/70">
                            <input
                              type="checkbox"
                              checked={slot.selectedTags.some((t) => t.ID === tag.ID)}
                              onChange={() => handleTagToggle(slotIndex, tag)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-blue-500" />
                              <span className="font-kanit text-gray-700">{tag.Name || `Tag #${tag.ID}`}</span>
                            </div>
                          </label>
                        ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ปุ่มสุ่ม */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleRandomizePlan}
            disabled={isRandomizing || !snackReady || !selectedDisease.ID}
            className="group relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white px-12 py-4 rounded-2xl font-kanit text-xl font-bold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative flex items-center gap-3">
              {isRandomizing ? <><RefreshCw className="w-6 h-6 animate-spin" />กำลังสุ่มแผน...</> : <><Shuffle className="w-6 h-6" />สุ่มแผนอาหารใหม่</>}
            </div>
          </button>
        </div>

        {/* Pin info */}
        {pinCount > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Pin className="w-5 h-5 text-amber-600" />
            <span className="font-kanit text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border">ปักหมุดแล้ว: {pinCount} เมนู</span>
          </div>
        )}

        {/* Last updated */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="font-kanit text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border">
            สุ่มล่าสุด: {lastRandomized.getTime() === 0 ? "—" : `${lastRandomized.toLocaleDateString("th-TH")} ${lastRandomized.toLocaleTimeString("th-TH")}`}
          </span>
        </div>

        {/* ตารางแผน */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-6 px-8 text-center">
            <h3 className="font-kanit font-bold text-2xl mb-1">
              {selectedDisease.ID ? `${selectedDisease.Name} ${selectedDisease.Stage}` : "ยังไม่เลือกระยะโรค"}
            </h3>
            <p className="font-kanit text-blue-100">แผนการรับประทานอาหารรายสัปดาห์</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <th className="border border-gray-200 px-6 py-4 font-kanit font-bold text-gray-800">วัน/มื้อ</th>
                  <th className="border border-gray-200 px-6 py-4 font-kanit font-bold text-purple-800">🌅 เช้า</th>
                  <th className="border border-gray-200 px-6 py-4 font-kanit font-bold text-orange-800">☕ ว่างเช้า</th>
                  <th className="border border-gray-200 px-6 py-4 font-kanit font-bold text-teal-800">🌞 กลางวัน</th>
                  <th className="border border-gray-200 px-6 py-4 font-kanit font-bold text-orange-800">🍎 ว่างบ่าย</th>
                  <th className="border border-gray-200 px-6 py-4 font-kanit font-bold text-purple-800">🌙 เย็น</th>
                </tr>
              </thead>

              <tbody>
                {selectedDisease.ID ? (
                  days.map((day) => {
                    const meals: DailyMeals = currentMealPlan[day] ?? makeEmptyDaily();

                    const MealCell = ({
                      mealType,
                      items,
                      isSnack = false,
                    }: {
                      mealType: MealType;
                      items: MealMenuInterface[];
                      isSnack?: boolean;
                    }) => {
                      // สี dot 
                      const dotClassForMain =
                        mealType === "กลางวัน"
                          ? "bg-gradient-to-br from-teal-400 to-teal-600"
                          : "bg-gradient-to-br from-purple-400 to-purple-600";

                      return (
                        <td className={`border border-gray-200 px-4 py-4 relative group ${isSnack ? "bg-gradient-to-br from-orange-50/40 to-yellow-50/40" : ""}`}>
                          {/* ปุ่มเลือกเมนูมุมขวาบน */}
                          {/* ปุ่มเลือกเมนู - แสดงตลอดบนมือถือ, hover เฉพาะ md+ */}
                          <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => openQuickPick(day, mealType)}
                              className={`p-1.5 rounded-lg bg-white/90 shadow-md border hover:shadow-lg hover:bg-white focus:outline-none focus:ring-2 transition-all duration-200
      ${isSnack
                                  ? "border-orange-200 focus:ring-orange-300"
                                  : mealType === "กลางวัน"
                                    ? "border-teal-200 focus:ring-teal-300"
                                    : "border-purple-200 focus:ring-purple-300"
                                }`}
                              title={`เลือก/เปลี่ยนเมนู${mealType}`}
                            >
                              {
                                // ไอคอน: มื้อว่างใช้ Plus (ส้ม), มื้อหลักใช้ ChefHat
                                isSnack ? (
                                  <Plus className="w-3.5 h-3.5 text-orange-600" />
                                ) : mealType === "กลางวัน" ? (
                                  <ChefHat className="w-3.5 h-3.5 text-teal-600" />
                                ) : (
                                  <ChefHat className="w-3.5 h-3.5 text-purple-600" />
                                )
                              }
                            </button>
                          </div>

                          {/* เนื้อหาแบบไม่มีกรอบ */}
                          {items?.length ? (
                            <ul className="space-y-2">
                              {items.map((mealMenu) => (
                                <li key={mealMenu.ID} className="flex items-start group">
                                  {/* dot สี */}
                                  {!isSnack ? (
                                    <div className={`w-3 h-3 ${dotClassForMain} rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}></div>
                                  ) : (
                                    <div
                                      className={`w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200 ${mealMenu.isFoodItem
                                          ? "bg-gradient-to-br from-green-400 to-emerald-600"
                                          : "bg-gradient-to-br from-orange-400 to-orange-600"
                                        }`}
                                    ></div>
                                  )}

                                  <div>
                                    {mealMenu.isFoodItem ? (
                                      <button
                                        onClick={() => navigate(`/fooditem/${mealMenu.MenuID}`)}
                                        className={`font-kanit text-gray-700 ${isSnack ? "group-hover:text-green-700 focus:ring-green-500" : "group-hover:text-purple-700 focus:ring-purple-500"
                                          } transition-colors duration-200 text-left hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded px-1`}
                                      >
                                        {mealMenu.PortionText}
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => navigate(`/menu/${mealMenu.MenuID}`)}
                                        className={`font-kanit text-gray-700 ${mealType === "กลางวัน" ? "group-hover:text-teal-700 focus:ring-teal-500" : "group-hover:text-purple-700 focus:ring-purple-500"
                                          } transition-colors duration-200 text-left hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded px-1`}
                                      >
                                        {mealMenu.PortionText}
                                      </button>
                                    )}

                                    {/* Badge สำหรับมื้อว่าง (ข้อ 2) */}
                                    {isSnack && (
                                      <>
                                        {mealMenu.isFoodItem ? (
                                          <span className="text-xs text-green-600 ml-1">(ผลไม้)</span>
                                        ) : mealMenu.isSpecialDessert ? (
                                          <span className="text-xs text-blue-600 ml-1">(หวานสำหรับเบาหวาน)</span>
                                        ) : (
                                          <span className="text-xs text-purple-600 ml-1">(ของหวาน)</span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="font-kanit text-gray-400 italic">
                              {isSnack ? "-" : "(ยังไม่เลือก)"}
                            </span>
                          )}

                          {/* ปุ่มปักหมุด */}
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => togglePin(day, mealType)}
                              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${isPinned(day, mealType) ? "text-amber-600 bg-amber-100 hover:bg-amber-200" : "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                                }`}
                              title={isPinned(day, mealType) ? "เอาปักหมุดออก" : "ปักหมุดเมนูนี้"}
                            >
                              <Pin className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      );
                    };

                    return (
                      <tr key={day} className="hover:bg-blue-50/40 transition-colors duration-200">
                        <td className={`border border-gray-200 px-6 py-6 font-kanit font-bold text-gray-800 ${(dayColors as any)[day as DayName] ?? ""} text-center`}>{day}</td>

                        {/* เช้า */}
                        <MealCell mealType="เช้า" items={meals.เช้า} />
                        {/* ว่างเช้า */}
                        <MealCell mealType="ว่างเช้า" items={meals["ว่างเช้า"]} isSnack />
                        {/* กลางวัน */}
                        <MealCell mealType="กลางวัน" items={meals.กลางวัน} />
                        {/* ว่างบ่าย */}
                        <MealCell mealType="ว่างบ่าย" items={meals["ว่างบ่าย"]} isSnack />
                        {/* เย็น */}
                        <MealCell mealType="เย็น" items={meals.เย็น} />
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400 font-kanit">
                      ยังไม่เลือกระยะโรค
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* วิธีใช้งานแบบเรียบง่าย */}
          {!!selectedDisease.ID && (
            <div className="p-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-t border-amber-200">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Pin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-kanit text-amber-800 font-bold text-lg mb-3">💡 วิธีใช้งาน</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm">
                      <p className="font-kanit text-amber-800 font-semibold mb-1">เลือก/ล็อกเมนูอย่างรวดเร็ว</p>
                      <p className="font-kanit text-amber-700 text-sm">ชี้เม้าส์ที่ช่อง แล้วกดไอคอน <b>ChefHat</b> มุมขวาบนเพื่อเลือกและปักหมุด</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm">
                      <p className="font-kanit text-amber-800 font-semibold mb-1">การสุ่มแผนอาหาร</p>
                      <p className="font-kanit text-amber-700 text-sm">ปุ่ม “สุ่มแผนอาหารใหม่” จะแทนที่ทุกช่องที่ <b>ไม่ได้</b> ปักหมุด</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm">
                      <p className="font-kanit text-amber-800 font-semibold mb-1">กติกาของหวาน</p>
                      <p className="font-kanit text-amber-700 text-sm">ถ้าเช้าเป็นของหวาน บ่ายจะเว้นว่าง (ยกเว้นบ่ายเป็นผลไม้ที่ปักหมุด) และกลับกัน</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm">
                      <p className="font-kanit text-amber-800 font-semibold mb-1">รีเซ็ตเมื่อเปลี่ยนเงื่อนไข</p>
                      <p className="font-kanit text-amber-700 text-sm">เปลี่ยนระยะโรคหรือแผนหมดอายุ จะล้างปักหมุดอัตโนมัติ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={handlePrint}
            disabled={!isPlanReady}
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-kanit text-lg font-medium shadow-lg ${isPlanReady ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-gradient-to-r from-blue-300 to-blue-400 text-white opacity-70 cursor-not-allowed"
              }`}
            title={isPlanReady ? "พิมพ์แผนอาหาร" : "ยังไม่มีแผนที่พร้อมพิมพ์"}
          >
            <FileText className="w-5 h-5" />
            พิมพ์แผนอาหาร
          </button>

          <button
            onClick={handleDownload}
            disabled={!isPlanReady}
            className={`flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-2xl font-kanit text-lg font-medium shadow-lg ${!isPlanReady ? "opacity-50 cursor-not-allowed" : ""
              }`}
            title={isPlanReady ? "ดาวน์โหลด PDF" : "ยังไม่มีแผนที่พร้อมดาวน์โหลด"}
          >
            <Download className="w-5 h-5" />
            ดาวน์โหลด PDF
          </button>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            disabled={!selectedDisease.ID}
            className={`flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-2xl font-kanit text-lg font-medium shadow-lg ${!selectedDisease.ID ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <FileText className="w-5 h-5" />
            {showRecommendations ? "ซ่อนคำแนะนำ" : "ดูคำแนะนำโภชนาการ"}
          </button>
        </div>

        {/* Recommendations */}
        {showRecommendations && !!selectedDisease.ID && (
          <div className="mt-12 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white py-8 px-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-kanit font-bold text-2xl mb-2">{rec.title}</h3>
              <p className="font-kanit text-orange-100">คำแนะนำโภชนาการและการดูแลสุขภาพ</p>
            </div>

            <div className="p-8">
              {/* General */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">!</span>
                  </div>
                  <h4 className="font-kanit text-xl font-bold text-gray-800">คำแนะนำทั่วไป</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rec.general.map((item, index) => (
                    <div key={index} className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="font-kanit text-gray-700 leading-relaxed">{item}</span>
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
                  <h4 className="font-kanit text-xl font-bold text-gray-800">แนวทางโภชนาการ</h4>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(rec.nutrition || {}).map(([nutrient, amount]) => (
                      <div key={nutrient} className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                        <span className="font-kanit font-semibold text-gray-700">{nutrient}:</span>
                        <span className="font-kanit text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full">{amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Food choices */}
              {Array.isArray(rec.foodChoices) && rec.foodChoices.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">F</span>
                    </div>
                    <h4 className="font-kanit text-xl font-bold text-gray-800">คำแนะนำการเลือกอาหาร</h4>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <div className="grid grid-cols-1 gap-4">
                      {rec.foodChoices.map((fc, index) => (
                        <div key={index} className="flex items-start p-4 bg-white rounded-xl border border-purple-200 shadow-sm">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="text-white text-xs font-bold">{fc.FoodChoiceID}</span>
                          </div>
                          <div>
                            <span className="font-kanit font-semibold text-purple-700 block mb-1">{fc.FoodChoice?.FoodName}</span>
                            <span className="font-kanit text-gray-600 text-sm">{fc.Description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Food lists */} <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> <div> <div className="flex items-center mb-6"> <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3"> <span className="text-white font-bold text-sm">✓</span> </div> <h4 className="font-kanit text-xl font-bold text-green-600"> อาหารที่แนะนำ </h4> </div> <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200"> <ul className="space-y-3"> {getRecommendations()?.foods.แนะนำ.map((food, index) => (<li key={index} className="flex items-start p-3 bg-white rounded-xl border border-green-200 hover:shadow-sm transition-all duration-300" > <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0"> <span className="text-white text-xs font-bold">✓</span> </div> <span className="font-kanit text-gray-700">{food}</span> </li>))} </ul> </div> </div> <div> <div className="flex items-center mb-6"> <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mr-3"> <span className="text-white font-bold text-sm">✕</span> </div> <h4 className="font-kanit text-xl font-bold text-red-600"> อาหารที่ควรหลีกเลี่ยง </h4> </div> <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200"> <ul className="space-y-3"> {getRecommendations()?.foods.ควรหลีกเลี่ยง.map((food, index) => (<li key={index} className="flex items-start p-3 bg-white rounded-xl border border-red-200 hover:shadow-sm transition-all duration-300" > <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0"> <span className="text-white text-xs font-bold">✕</span> </div> <span className="font-kanit text-gray-700">{food}</span> </li>))} </ul> </div> </div> </div> {/* Notice */} <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-2xl p-6"> <div className="flex items-start"> <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0"> <span className="text-white font-bold text-sm">!</span> </div> <div> <p className="font-kanit font-semibold text-yellow-800 mb-2"> ข้อควรระวัง </p> <p className="font-kanit text-yellow-700 leading-relaxed"> คำแนะนำเหล่านี้เป็นแนวทางทั่วไป ควรปรึกษาแพทย์หรือนักโภชนาการ เพื่อการวางแผนอาหารที่เหมาะสมกับสภาวะสุขภาพของท่านโดยเฉพาะ </p> </div> </div> </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== Enhanced QuickPick Modal ===================== */}
      {quickPick.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-kanit font-bold text-xl">เลือกรายการอาหาร</h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {quickPick.day} • {quickPick.mealType}
                    </p>
                  </div>
                </div>
                <button onClick={closeQuickPick} className="p-3 rounded-2xl hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-200">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Search + Filter */}
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
                  <input
                    value={quickPick.keyword}
                    onChange={(e) => setQuickPick((s) => ({ ...s, keyword: e.target.value }))}
                    placeholder="ค้นหาเมนูอาหาร ผลไม้ หรือของหวาน..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/15 text-white placeholder:text-blue-200/70 border border-white/20 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white/20"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "ทั้งหมด", icon: Filter },
                    { key: "menu", label: "เมนูอาหาร", icon: ChefHat },
                    { key: "food", label: "ผลไม้", icon: Star },
                    { key: "dessert", label: "ของหวาน", icon: Star },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setQuickPick((s) => ({ ...s, filterType: key as QuickPickFilter }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-kanit transition-all duration-200 ${quickPick.filterType === key ? "bg-white/30 text-white shadow-lg" : "bg-white/10 text-blue-100 hover:bg-white/20"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 gap-3">
                  {filteredOptions.map((option) => (
                    <button
                      key={`${option.isFoodItem ? "F" : option.kind === "dessert" ? "D" : "M"}-${option.id}`}
                      onClick={() => chooseManualForCell(option)}
                      className="group w-full text-left p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${option.kind === "food"
                              ? "bg-gradient-to-br from-green-400 to-emerald-500"
                              : option.kind === "dessert"
                                ? "bg-gradient-to-br from-blue-400 to-blue-500"
                                : "bg-gradient-to-br from-purple-400 to-purple-500"
                            }`}
                        >
                          {option.kind === "food" ? <Star className="w-6 h-6 text-white" /> : <ChefHat className="w-6 h-6 text-white" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-kanit font-semibold text-gray-800 text-lg group-hover:text-blue-700 transition-colors truncate">
                            {option.label}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {option.kind === "food" && (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">ผลไม้</span>
                            )}
                            {option.kind === "dessert" && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                {option.isDiabeticDessert ? "หวานสำหรับเบาหวาน" : "ของหวาน"}
                              </span>
                            )}
                            {option.kind === "menu" && (
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">เมนู</span>
                            )}
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">เลือกและปักหมุด</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredOptions.length === 0 && (
                    <div className="text-center text-gray-500 font-kanit py-8">ไม่พบรายการที่ตรงกับการค้นหา/ตัวกรอง</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* =================== /Enhanced QuickPick Modal ====================== */}
    </div>
  );
};

export default MealPlannerApp;
