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
  },
  
  // Header styles
  mainTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
    color: "#1a1a1a",
  },
  
  subtitle: {
    fontSize: 11,
    textAlign: "center",
    color: "#666666",
  },
  
  // Section styles
  sectionTitle: {
    fontSize: 13,
    marginTop: 5,
    marginBottom: 10,
    color: "#1a1a1a",
    textAlign: "left",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 5,
  },
  
  // Patient info styles
  patientInfoContainer: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  
  patientInfoTitle: {
    fontSize: 11,
    marginBottom: 8,
    color: "#1a1a1a",
  },
  
  patientInfoText: {
    fontSize: 9,
    marginBottom: 3,
    color: "#333333",
  },
  
  ibwNote: {
    fontSize: 8,
    color: "#666666",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  
  // Table styles (simplified)
  tableContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  
  tableHeaderRow: {
    backgroundColor: "#e6e6e6",
  },
  
  tableCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#cccccc",
    textAlign: "center",
    fontSize: 9,
  },
  
  mealCell: {
    textAlign: "left",
    backgroundColor: "#f0f0f0",
    color: "#1a1a1a",
  },
  
  headerCell: {
    color: "#1a1a1a",
    fontSize: 9,
  },
  
  // Nutrition summary
  nutritionSummary: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  
  caloriesText: {
    fontSize: 12,
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  
  nutritionItem: {
    marginBottom: 3,
    fontSize: 9,
    color: "#333333",
  },
  
  // Food group styles
  foodGroupContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  
  foodGroupTitle: {
    fontSize: 11,
    color: "#1a1a1a",
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 3,
  },
  
  foodGroupText: {
    fontSize: 9,
    color: "#333333",
    marginBottom: 4,
  },
  
  // Conditional items
  conditionalContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  
  conditionalTitle: {
    fontSize: 11,
    color: "#1a1a1a",
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 3,
  },
  
  conditionalItem: {
    marginBottom: 6,
    padding: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eeeeee",
  },
  
  conditionalItemTitle: {
    fontSize: 10,
    color: "#1a1a1a",
    marginBottom: 3,
  },
  
  conditionalItemDesc: {
    fontSize: 9,
    color: "#333333",
  },
  
  // Exchange styles
  exchangeContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  
  exchangeTitle: {
    fontSize: 11,
    color: "#1a1a1a",
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 3,
  },
  
  exchangeGroup: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eeeeee",
  },
  
  exchangeGroupTitle: {
    fontSize: 10,
    color: "#1a1a1a",
    marginBottom: 3,
  },
  
  exchangeItems: {
    fontSize: 9,
    color: "#333333",
  },
  
  // Simple divider
  divider: {
    height: 1,
    backgroundColor: "#cccccc",
    marginVertical: 10,
  },
  
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#666666",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingTop: 5,
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
  src: "/Sarabun-Regular.ttf",
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
        <Text style={styles.mainTitle}>แผนการควบคุมอาหารเฉพาะบุคคล</Text>
        <Text style={styles.subtitle}>Daily Nutrition Management Plan</Text>
        
        <View style={styles.divider} />

        {/* Patient Information */}
        <View style={styles.patientInfoContainer}>
          <Text style={styles.patientInfoTitle}>ข้อมูลผู้ป่วย</Text>
          
          <Text style={styles.patientInfoText}>
            โรค: {ruleDatas?.DiseaseName}
            {ruleDatas?.DiseaseStage && ruleDatas.DiseaseStage !== "-"
              ? ` (${ruleDatas.DiseaseStage})`
              : ""} {' '}
          
            อายุ: {ruleDatas?.AgeMin === 0
              ? `ไม่เกิน ${ruleDatas.AgeMax} ปี`
              : ruleDatas?.AgeMax === 200
              ? `${ruleDatas.AgeMin} ปี ขึ้นไป`
              : `${ruleDatas.AgeMin} - ${ruleDatas.AgeMax} ปี`} {' '}
          
            IBW: {ruleDatas?.IBWMin === 0
              ? `ไม่เกิน ${ruleDatas.IBWMax} kg`
              : ruleDatas?.IBWMax === 200
              ? `${ruleDatas.IBWMin} kg ขึ้นไป`
              : `${ruleDatas.IBWMin} - ${ruleDatas.IBWMax} kg`} {' '}
          </Text>
          
          <Text style={styles.ibwNote}>
            หมายเหตุ: IBW (Ideal Body Weight) = น้ำหนักมาตรฐานตามส่วนสูง (ซม.) ลบ 105 สำหรับผู้หญิง หรือ 100 สำหรับผู้ชาย
          </Text>
        </View>

        {/* Main Table */}
        <Text style={styles.sectionTitle}>ปริมาณอาหารที่ควรทานต่อวัน</Text>
        
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            <Text style={[styles.tableCell, styles.headerCell, styles.mealCell]}>
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
          {mealTimes.map((mealTime) => (
            <View key={mealTime} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.mealCell]}>{mealTime}</Text>
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
          
          <Text style={[styles.sectionTitle, { marginTop: 5, fontSize: 11 }]}>
            สารอาหารหลัก
          </Text>
          
          {nutritionDatas.map((item) => (
            <Text key={item.nutrition_group_name} style={styles.nutritionItem}>
              {item.nutrition_group_name}: {item.amount_in_grams} กรัม ({item.amount_in_percentage}%)
            </Text>
          ))}
        </View>

        {/* Food Groups */}
        {foodGroups.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>คำแนะนำการเลือกอาหาร  </Text>
            
            {foodGroups.map((group) => (
              <View key={group.topic} style={styles.foodGroupContainer}>
                <Text style={styles.foodGroupTitle}>{group.topic}</Text>
                
                <Text style={styles.foodGroupText}>
                  ควรทาน: {group.recommended.length > 0
                    ? group.recommended
                        .map((item) => item.Name)
                        .join(", ")
                    : "ไม่มีข้อมูล"}{' '}
                </Text>
                
                <Text style={styles.foodGroupText}>
                  ควรเลี่ยง: {group.avoided.length > 0
                    ? group.avoided
                        .map((item) => item.Name)
                        .join(", ")
                    : "ไม่มีข้อมูล"}{' '}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Conditional Cards */}
        {conditionalCardData.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>ข้อควรระวังเป็นพิเศษ</Text>
            
            {conditionalCardData.map((card, index) => (
              <View key={index} style={styles.conditionalContainer}>
                <Text style={styles.conditionalItemTitle}>{card.name}</Text>
                <Text style={styles.conditionalItemDesc}>{card.description}</Text>
              </View>
            ))}
          </>
        )}

        {/* Food Exchange */}
        {foodExchangeGroups.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>รายการอาหารแลกเปลี่ยน</Text>
            
            <View style={styles.exchangeContainer}>
              {(() => {
                const groupedExchanges = foodExchangeGroups.reduce((acc, item) => {
                  const groupName = item.FoodItem?.FoodFlag?.FoodGroup?.Name || 'อื่นๆ';
                  if (!acc[groupName]) {
                    acc[groupName] = [];
                  }
                  acc[groupName].push(item);
                  return acc;
                }, {} as Record<string, FoodExchangeInterface[]>);

                return Object.entries(groupedExchanges).map(([groupName, items]) => (
                  <View key={groupName} style={styles.exchangeGroup}>
                    <Text style={styles.exchangeGroupTitle}>
                      {groupName} 1 ส่วน เท่ากับ
                    </Text>
                    <Text style={styles.exchangeItems}>
                      {items
                        .filter((item) => item.FoodItem?.Name)
                        .map((item) => 
                          `${item.FoodItem?.Name} ${item.Amount || ''} ${item.Unit || ''}`
                        )
                        .join(', ')} {' '}
                    </Text>
                  </View>
                ));
              })()}
            </View>
          </>
        )}
        
        {/* Footer */}
        <Text style={styles.footer}>
          เอกสารจัดทำโดยระบบจัดการโภชนาการ • สร้างเมื่อ {new Date().toLocaleDateString('th-TH')} • กรุณาปรึกษานักโภชนาการก่อนการใช้งาน
        </Text>
      </Page>
    </Document>
  );
};

export default NutritionPDF;