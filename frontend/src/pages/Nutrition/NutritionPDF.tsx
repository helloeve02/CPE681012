
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type {
  ConditionalCardItem,
  NutritionData,
  PortionData,
  RuleData,
} from "../../interfaces/Nutrition";
import type { FoodGroupData } from "./PDFViewerPage";
import type { FoodExchangeInterface } from "../../interfaces/FoodExchange";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Sarabun",
    lineHeight: 1.5,
    backgroundColor: "#fafafa",
  },

  // Header styles
  headerContainer: {
    backgroundColor: "#e5e7eb", // Changed from dark blue to light gray
    padding: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#1e40af",
  },

  mainTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
    color: "#1f2937", // Changed from white to dark gray
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#374151", // Changed from light blue to dark gray
    fontWeight: "bold",
  },

  // Section styles
  sectionTitle: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 12,
    color: "#1f2937",
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    fontWeight: "bold",
  },

  // Patient info styles
  patientInfoContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#10b981",
  },

  patientInfoTitle: {
    fontSize: 13,
    marginBottom: 10,
    color: "#1f2937",
    fontWeight: "bold",
  },

  patientInfoText: {
    fontSize: 10,
    marginBottom: 4,
    color: "#374151",
  },

  patientInfoLabel: {
    fontSize: 10,
    marginBottom: 4,
    color: "#374151",
    fontWeight: "bold",
  },

  ibwNote: {
    fontSize: 10,
    color: "#6b7280",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },

  ibwNoteLabel: {
    fontSize: 10,
    color: "#6b7280",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    fontWeight: "bold",
  },

  // Table styles
  tableContainer: {
    marginVertical: 15,
    borderWidth: 2,
    borderColor: "#3b82f6",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 35,
  },

  tableHeaderRow: {
    backgroundColor: "#dbeafe", // Changed from blue to light blue
    minHeight: 40,
  },

  tableCell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    textAlign: "center",
    fontSize: 10,
  },

  mealCell: {
    textAlign: "left",
    backgroundColor: "#bfdbfe", // Changed from dark blue to lighter blue
    color: "#1f2937", // Changed from white to dark gray
    fontSize: 10,
    fontWeight: "bold",
  },

  headerCell: {
    color: "#1f2937", // Changed from white to dark gray
    fontSize: 10,
    fontWeight: "bold",
  },

  // Nutrition summary
  nutritionSummary: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 15,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },

  caloriesText: {
    fontSize: 14,
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },

  nutritionItem: {
    marginBottom: 6,
    padding: 8,
    backgroundColor: "#fef3c7",
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },

  nutritionItemText: {
    fontSize: 10,
    color: "#1f2937",
  },

  nutritionItemLabel: {
    fontSize: 10,
    color: "#1f2937",
    fontWeight: "bold",
  },

  // Food group styles
  foodGroupContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#10b981",
  },

  foodGroupTitle: {
    fontSize: 12,
    color: "#000000ff",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 4,
    fontWeight: "bold",
  },

  recommendedSection: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#d1fae5",
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
  },

  avoidedSection: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#fee2e2",
    borderLeftWidth: 3,
    borderLeftColor: "#ef4444",
  },

  foodGroupLabel: {
    fontSize: 10,
    marginBottom: 4,
    fontWeight: "bold",
  },

  recommendedLabel: {
    color: "#065f46",
  },

  avoidedLabel: {
    color: "#991b1b",
  },

  foodGroupText: {
    fontSize: 10,
    color: "#1f2937",
  },

  // Conditional items
  conditionalContainer: {
    marginBottom: 120,
    padding: 12,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#f59e0b",
  },

  conditionalTitle: {
    fontSize: 13,
    color: "#1f2937",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 4,
    fontWeight: "bold",
  },

  conditionalItem: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fbbf24",
  },

  conditionalItemTitle: {
    fontSize: 11,
    color: "#92400e",
    marginBottom: 4,
    fontWeight: "bold",
  },

  conditionalItemDesc: {
    fontSize: 9,
    color: "#1f2937",
  },

  // Exchange styles
  exchangeContainer: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#8b5cf6",
  },

  exchangeTitle: {
    fontSize: 13,
    color: "#1f2937",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 4,
    fontWeight: "bold",
  },

  exchangeGroup: {
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#f3e8ff",
    borderWidth: 1,
    borderColor: "#c4b5fd",
  },

  exchangeGroupTitle: {
    fontSize: 10,
    color: "#6b21a8",
    marginBottom: 4,
    fontWeight: "bold",
  },

  exchangeItems: {
    fontSize: 10,
    color: "#1f2937",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 15,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#6b7280",
    borderTopWidth: 2,
    borderTopColor: "#3b82f6",
    paddingTop: 8,
    backgroundColor: "#f8fafc",
    padding: 10,
    fontWeight: "bold",
  },

  // Simple divider
  divider: {
    height: 2,
    backgroundColor: "#3b82f6",
    marginVertical: 15,
  },
});

type Props = {
  nutritionDatas: NutritionData[];
  portionDatas: PortionData[];
  caloryDatas: number;
  ruleDatas: RuleData;
  foodGroups: FoodGroupData[];
  conditionalCardData: ConditionalCardItem[];
  foodExchangeGroups: FoodExchangeInterface[];
};

Font.register({
  family: "Sarabun",
  fonts: [
    {
      src: "/Sarabun-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/Sarabun-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const mealTimes = ["เช้า", "กลางวัน", "เย็น"];

const insertSoftBreak = (text: string): string => {
  return text.replace(/แป้งปลอดโปรตีน/g, "แป้งปลอด\u00ADโปรตีน");
};

const NutritionPDF: React.FC<Props> = ({
  nutritionDatas,
  portionDatas,
  caloryDatas,
  ruleDatas,
  foodGroups,
  conditionalCardData,
  foodExchangeGroups,
}) => {
  // Grouped by food group
  const groupedByFoodGroup = portionDatas.reduce((acc, item) => {
    if (!acc[item.food_group_name]) {
      acc[item.food_group_name] = [];
    }
    acc[item.food_group_name].push(item);
    return acc;
  }, {} as Record<string, PortionData[]>);

  const foodGroupNames = Object.keys(groupedByFoodGroup);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>แผนการควบคุมอาหารเฉพาะบุคคล</Text>
          <Text style={styles.subtitle}>Daily Nutrition Management Plan</Text>
        </View>

        {/* Patient Information */}
        <View style={styles.patientInfoContainer}>
          <Text style={styles.patientInfoTitle}>ข้อมูลผู้ป่วย</Text>

          <Text style={styles.patientInfoText}>
            โรค: {ruleDatas?.DiseaseName}
            {ruleDatas?.DiseaseStage && ruleDatas.DiseaseStage !== "-"
              ? ` (${ruleDatas.DiseaseStage})`
              : ""}
          </Text>

          <Text style={styles.patientInfoText}>
            อายุ:{" "}
            {ruleDatas?.AgeMin === 0
              ? `ไม่เกิน ${ruleDatas.AgeMax} ปี`
              : ruleDatas?.AgeMax === 200
              ? `${ruleDatas.AgeMin} ปี ขึ้นไป`
              : `${ruleDatas.AgeMin} - ${ruleDatas.AgeMax} ปี`}
          </Text>

          <Text style={styles.patientInfoText}>
            IBW:{" "}
            {ruleDatas?.IBWMin === 0
              ? `ไม่เกิน ${ruleDatas.IBWMax} kg`
              : ruleDatas?.IBWMax === 200
              ? `${ruleDatas.IBWMin} kg ขึ้นไป`
              : `${ruleDatas.IBWMin} - ${ruleDatas.IBWMax} kg`}
          </Text>

          <Text style={styles.ibwNote}>
            หมายเหตุ: IBW (Ideal Body Weight) = น้ำหนักมาตรฐานตามส่วนสูง (ซม.)
            ลบ 105 สำหรับผู้หญิง หรือ 100 สำหรับผู้ชาย  .
          </Text>
        </View>

        {/* Main Table */}
        <Text style={styles.sectionTitle}>ปริมาณอาหารที่ควรทานต่อวัน</Text>

        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            <Text
              style={[styles.tableCell, styles.headerCell, styles.mealCell]}
            >
              มื้ออาหาร
            </Text>
            {foodGroupNames.map((foodGroupName) => (
              <Text
                key={foodGroupName}
                wrap={true}
                style={[styles.tableCell, styles.headerCell]}
              >
                {insertSoftBreak(foodGroupName)}
              </Text>
            ))}
          </View>

          {/* Table Body */}
          {mealTimes.map((mealTime, index) => (
            <View key={mealTime} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.mealCell]}>
                {mealTime}
              </Text>
              {foodGroupNames.map((group) => {
                const item = groupedByFoodGroup[group]?.find(
                  (i) => i.meal_time_name === mealTime
                );
                return (
                  <Text key={group} style={styles.tableCell}>
                    {item && item.amount > 0
                      ? `${item.amount} ${item.unit}`
                      : "-"}
                  </Text>
                );
              })}
            </View>
          ))}
        </View>

        {/* Nutrition Summary */}
        <View style={styles.nutritionSummary}>
          <Text style={styles.caloriesText}>
            พลังงานรวม: {caloryDatas} กิโลแคลอรี่
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              {
                marginTop: 10,
                fontSize: 12,
                backgroundColor: "transparent",
                padding: 0,
                borderLeftWidth: 0,
              },
            ]}
          >
            สารอาหารหลัก
          </Text>

          {nutritionDatas.map((item) => (
            <View key={item.nutrition_group_name} style={styles.nutritionItem}>
              <Text style={styles.nutritionItemText}>
                {item.nutrition_group_name}: {item.amount_in_grams} กรัม (
                {item.amount_in_percentage}%)
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Food Groups */}
        {foodGroups.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>คำแนะนำการเลือกอาหาร .</Text>

            {foodGroups.map((group) => (
              <View key={group.topic} style={styles.foodGroupContainer}>
                <Text style={styles.foodGroupTitle}>{group.topic}</Text>

                <View style={styles.recommendedSection}>
                  <Text
                    style={[styles.foodGroupLabel, styles.recommendedLabel]}
                  >
                    [ / ] ควรทาน:
                  </Text>
                  <Text style={styles.foodGroupText}>
                    {group.recommended.length > 0
                      ? group.recommended
                          .map((item, index, arr) =>
                            index === arr.length - 1
                              ? item.Name + "\u00A0"
                              : item.Name
                          )
                          .join(", ")
                      : "ไม่มีข้อมูล"}
                  </Text>
                </View>

                <View style={styles.avoidedSection}>
                  <Text style={[styles.foodGroupLabel, styles.avoidedLabel]}>
                    [ X ] ควรเลี่ยง:
                  </Text>
                  <Text style={styles.foodGroupText}>
                    {group.avoided.length > 0
                      ? group.avoided
                          .map((item, index, arr) =>
                            index === arr.length - 1
                              ? item.Name + "\u00A0\u00A0\u00A0\u00A0"
                              : item.Name
                          )
                          .join(", ")
                      : "ไม่มีข้อมูล"}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Conditional Cards */}
        {conditionalCardData.length > 0 && (
          <>
            <View style={styles.conditionalContainer}>
              <Text style={styles.conditionalTitle}>
                [ ! ] ข้อควรระวังเป็นพิเศษ
              </Text>

              {conditionalCardData.map((card, index) => (
                <View key={index} style={styles.conditionalItem}>
                  <Text style={styles.conditionalItemTitle}>{card.name}</Text>
                  <Text style={styles.conditionalItemDesc}>
                    {card.description}{" "}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Food Exchange */}
        {foodExchangeGroups.length > 0 && (
          <>
            <View style={styles.exchangeContainer}>
              <Text style={styles.exchangeTitle}>รายการอาหารแลกเปลี่ยน</Text>

              {(() => {
                const groupedExchanges = foodExchangeGroups.reduce(
                  (acc, item) => {
                    const groupName =
                      item.FoodItem?.FoodFlag?.FoodGroup?.Name || "อื่นๆ";
                    if (!acc[groupName]) {
                      acc[groupName] = [];
                    }
                    acc[groupName].push(item);
                    return acc;
                  },
                  {} as Record<string, FoodExchangeInterface[]>
                );

                return Object.entries(groupedExchanges).map(
                  ([groupName, items]) => (
                    <View key={groupName} style={styles.exchangeGroup}>
                      <Text style={styles.exchangeGroupTitle}>
                        {groupName} 1 ส่วน เท่ากับ
                      </Text>
                      <Text style={styles.exchangeItems}>
                        {items
                          .filter((item) => item.FoodItem?.Name)
                          .map((item, index, arr) => {
                            const text = `${item.FoodItem?.Name}${
                              item.Amount ? ` ${item.Amount}` : ""
                            }${item.Unit ? ` ${item.Unit}` : ""}`;
                            // If this is the last item in the array, append a space
                            return index === arr.length - 1
                              ? text + "\u00A0"
                              : text;
                          })
                          .join(", ")}
                      </Text>
                    </View>
                  )
                );
              })()}
            </View>
          </>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          เอกสารจัดทำโดยระบบจัดการโภชนาการ • สร้างเมื่อ{" "}
          {new Date().toLocaleDateString("th-TH")} •
          กรุณาปรึกษานักโภชนาการก่อนการใช้งาน
        </Text>
      </Page>
    </Document>
  );
};

export default NutritionPDF;