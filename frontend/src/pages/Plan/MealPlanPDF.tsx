import React from "react";
import { Document, Page, Text, View, StyleSheet /*, Font*/ } from "@react-pdf/renderer";
import type { MealPlan } from "./Mealplan";



type FoodChoiceLite = {
  FoodChoiceID?: number;
  FoodChoice?: { FoodName?: string };
  Description?: string;
};

interface Recommendations {
  title: string;
  general: string[];
  nutrition: Record<string, string>;
  foods: { แนะนำ: string[]; ควรหลีกเลี่ยง: string[] };
  foodChoices?: FoodChoiceLite[];
}

interface MealPlanPDFProps {
  mealPlan: MealPlan;
  diseaseTitle?: string;     // เช่น "โรคไตระยะ 3b"
  generatedAt?: Date;        // วันที่สร้างไฟล์
  recommendations?: Recommendations;
}

/** --------------------------------------------------------
 *  พาเล็ตต์สี (เหมาะกับทั้งสีและขาวดำ)
 *  - ใช้หัวตารางน้ำเงินเข้ม, แถวสลับฟ้าอ่อน
 *  - ชิปสีเขียว/แดงอ่อน + เส้นกรอบเข้ม
 *  - เส้นกรอบ/ข้อความหลักเป็นโทนเข้มอ่านง่าย
 * -------------------------------------------------------- */
const P = {
  ink: "#111827",
  sub: "#4b5563",
  line: "#1f2937",
  faintLine: "#9ca3af",
  zebra: "#eff6ff",       // ฟ้าอ่อน (แถวสลับ)
  headerBg: "#2563eb",    // น้ำเงินเข้ม (หัวตาราง)
  headerText: "#ffffff",  // ตัวอักษรหัวตาราง
  chipOkBorder: "#15803d",
  chipOkBg: "#dcfce7",
  chipAvoidBorder: "#b91c1c",
  chipAvoidBg: "#fee2e2",
  sectionBg: "#f9fafb",
  divider: "#a855f7",     // ม่วงอ่อน
  noteBg: "#f3f4f6",
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Sarabun",
    fontSize: 10,
    color: P.ink,
  },

  // ---------- Header ----------
  headerWrap: {
    borderWidth: 1,
    borderColor: P.line,
    borderStyle: "solid",
    padding: 12,
    marginBottom: 14,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 10,
    textAlign: "center",
    color: P.sub,
  },

  // ---------- Legend ----------
  legendRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    justifyContent: "center",
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendSwatch: {
    width: 10, height: 10, borderWidth: 1, borderStyle: "solid", borderColor: P.faintLine,
  },
  legendText: { fontSize: 9, color: P.sub },

  // ---------- Table ----------
  table: { width: "100%", borderWidth: 1, borderColor: P.line, borderStyle: "solid" },
  row: {
    flexDirection: "row",
    minHeight: 42,
    borderBottomWidth: 1,
    borderBottomColor: P.line,
    borderBottomStyle: "solid",
  },
  headerRow: {
    // ใช้ background ตอนเรนเดอร์จริง
  },
  zebraRow: {
    backgroundColor: P.zebra,
  },
  cell: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: P.line,
    borderRightStyle: "solid",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  timeCell: {
    width: 68,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
  },
  headerTextLight: {
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
    color: P.headerText,
  },
  dayText: {
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
  },
  mealText: {
    fontSize: 9,
    lineHeight: 1.25,
    marginBottom: 2,
  },

  // ---------- Section ----------
  section: {
    borderWidth: 1,
    borderColor: P.line,
    borderStyle: "solid",
    padding: 10,
    marginTop: 14,
    backgroundColor: P.sectionBg,
  },
  sectionTitleBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  sectionIcon: { fontSize: 12 }, // ใช้สัญลักษณ์ตัวอักษรแทนไอคอน
  sectionTitle: { fontSize: 13, fontWeight: "bold" },

  // ---------- Lists ----------
  bullet: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { width: 12 }, // "• " ใส่ใน Text
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.35 },

  // ---------- Key-Value grid ----------
  kvGrid: { flexDirection: "row", flexWrap: "wrap" },
  kvItem: { width: "50%", paddingRight: 8, marginBottom: 8 },
  kvName: { fontWeight: "bold" },
  kvValue: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: P.faintLine,
    borderStyle: "dashed", // dashed เพื่อเห็นเส้นแม้พิมพ์ขาวดำ
    borderRadius: 3,
    marginTop: 2,
    backgroundColor: "#ffffff",
  },

  // ---------- Chips ----------
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  chip: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chipOk: { borderColor: P.chipOkBorder, backgroundColor: P.chipOkBg },
  chipAvoid: { borderColor: P.chipAvoidBorder, backgroundColor: P.chipAvoidBg },

  // ---------- Divider ----------
  divider: {
    height: 1,
    backgroundColor: P.divider,
    marginVertical: 10,
  },

  // ---------- Note ----------
  note: {
    color: P.sub,
    fontSize: 9,
    marginTop: 8,
    backgroundColor: P.noteBg,
    borderWidth: 1,
    borderColor: P.faintLine,
    borderStyle: "solid",
    padding: 8,
    textAlign: "center",
  },
});

const MealPlanPDF: React.FC<MealPlanPDFProps> = ({
  mealPlan,
  diseaseTitle,
  generatedAt,
  recommendations
}) => {
  const timeSlots = ["เช้า", "ว่างเช้า", "กลางวัน", "ว่างบ่าย", "เย็น"];
  const days = Object.keys(mealPlan);

  const dateText = generatedAt
    ? new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(generatedAt)
    : "";

  return (
    <Document>
      {/* ---------- Page 1: ตารางแผนมื้ออาหาร ---------- */}
      <Page style={styles.page} size="A4">
        <View style={styles.headerWrap}>
          <Text style={styles.title}>แผนการทานอาหารประจำสัปดาห์</Text>
          <Text style={styles.subTitle}>
            {diseaseTitle || "ยังไม่เลือกระยะโรค"}
            {dateText ? ` • สร้างเมื่อ ${dateText}` : ""}
          </Text>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: "#ffffff" }]} />
              <Text style={styles.legendText}>แถวปกติ</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: P.zebra }]} />
              <Text style={styles.legendText}>แถวสลับ</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: P.headerBg }]} />
              <Text style={styles.legendText}>หัวตาราง</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          {/* Header Row (background น้ำเงิน, ตัวอักษรขาว) */}
          <View style={[styles.row, styles.headerRow]}>
            <View style={[styles.cell, styles.timeCell, { backgroundColor: P.headerBg }]}>
              <Text style={styles.headerTextLight}>วัน</Text>
            </View>
            {timeSlots.map((slot) => (
              <View key={slot} style={[styles.cell, { backgroundColor: P.headerBg }]}>
                <Text style={styles.headerTextLight}>{slot}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows + zebra */}
          {days.map((day, idx) => (
            <View
              key={day}
              style={idx % 2 === 1 ? [styles.row, styles.zebraRow] : [styles.row]}
            >
              <View style={[styles.cell, styles.timeCell]}>
                <Text style={styles.dayText}>{day}</Text>
              </View>

              {timeSlots.map((slot) => {
                const meals = (mealPlan as any)[day]?.[slot] || [];
                return (
                  <View key={`${day}-${slot}`} style={styles.cell}>
                    {meals.length > 0 ? (
                      meals.map((meal: any, i: number) => (
                        <Text key={meal?.ID || i} style={styles.mealText}>
                          {/* สัญลักษณ์ ● ช่วยให้โดดเด่นแม้พิมพ์ขาวดำ */}
                          ● {meal?.PortionText || "-"}
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.mealText}>-</Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <Text style={styles.note}>
          *หมายเหตุ: เมนูที่เลือกผ่าน QuickPick จะถือว่า “ล็อก/ปักหมุด” และจะไม่ถูกสุ่มทับ
        </Text>
      </Page>

      {/* ---------- Page 2: คำแนะนำโภชนาการ (มีเมื่อส่ง props) ---------- */}
      {recommendations && (
        <Page style={styles.page} size="A4">
          {/* General */}
          {!!recommendations.general?.length && (
            <View style={styles.section}>
              <View style={styles.sectionTitleBar}>
                <Text style={styles.sectionIcon}>■</Text>
                <Text style={styles.sectionTitle}>คำแนะนำทั่วไป</Text>
              </View>
              {recommendations.general.map((g, idx) => (
                <View key={idx} style={styles.bullet}>
                  <Text style={styles.bulletDot}>• </Text>
                  <Text style={styles.bulletText}>{g}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Nutrition Key-Values */}
          {!!recommendations.nutrition &&
            Object.keys(recommendations.nutrition).length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleBar}>
                  <Text style={styles.sectionIcon}>■</Text>
                  <Text style={styles.sectionTitle}>แนวทางโภชนาการ</Text>
                </View>

                <View style={styles.kvGrid}>
                  {Object.entries(recommendations.nutrition).map(([k, v]) => (
                    <View key={k} style={styles.kvItem}>
                      <Text style={styles.kvName}>{k}</Text>
                      <Text style={styles.kvValue}>{v}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          {/* Food choices */}
          {!!recommendations.foodChoices?.length && (
            <View style={styles.section}>
              <View style={styles.sectionTitleBar}>
                <Text style={styles.sectionIcon}>■</Text>
                <Text style={styles.sectionTitle}>คำแนะนำการเลือกอาหาร</Text>
              </View>
              {recommendations.foodChoices.map((fc, i) => (
                <View key={`${fc.FoodChoiceID || i}`} style={styles.bullet}>
                  <Text style={styles.bulletDot}>• </Text>
                  <Text style={styles.bulletText}>
                    {fc.FoodChoice?.FoodName || `ตัวเลือก ${fc.FoodChoiceID || i + 1}`} – {fc.Description || ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Food lists */}
          <View style={styles.section}>
            <View style={styles.sectionTitleBar}>
              <Text style={styles.sectionIcon}>■</Text>
              <Text style={styles.sectionTitle}>อาหารที่แนะนำ</Text>
            </View>
            <View style={styles.chipRow}>
              {(recommendations.foods?.แนะนำ || []).map((name, i) => (
                <View key={`ok-${i}`} style={[styles.chip, styles.chipOk]}>
                  <Text>✓</Text>
                  <Text>{name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleBar}>
              <Text style={styles.sectionIcon}>■</Text>
              <Text style={styles.sectionTitle}>อาหารที่ควรหลีกเลี่ยง</Text>
            </View>
            <View style={styles.chipRow}>
              {(recommendations.foods?.ควรหลีกเลี่ยง || []).map((name, i) => (
                <View key={`avoid-${i}`} style={[styles.chip, styles.chipAvoid]}>
                  <Text>⚠</Text>
                  <Text>{name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.note}>
            *คำแนะนำนี้เป็นแนวทางทั่วไป ควรปรึกษาแพทย์/นักโภชนาการเพื่อปรับให้เหมาะสมกับสภาวะของท่าน
          </Text>
        </Page>
      )}
    </Document>
  );
};

export default MealPlanPDF;
