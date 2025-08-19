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
  NutritionData,
  PortionData,
  RuleData,
} from "../../interfaces/Nutrition";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Sarabun",
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
    lineHeight: 1.3,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 11,
  },
  headerCell: {
    backgroundColor: "#eee",
  },
  mealCell: {
    textAlign: "left",
    backgroundColor: "#eee",
    paddingHorizontal: 6,
  },
  calories: {
    marginTop: 20,
    fontSize: 12,
  },
  nutritionList: {
    marginTop: 5,
    paddingLeft: 10,
  },
  nutritionItem: {
    marginBottom: 4,
  },
});

type Props = {
  nutritionDatas: NutritionData[];
  portionDatas: PortionData[];
  caloryDatas: number;
  ruleDatas: RuleData;
};

Font.register({
  family: "Sarabun",
  src: "/Sarabun-Regular.ttf",
});

const mealTimes = ["เช้า", "กลางวัน", "เย็น"];

const insertSoftBreak = (text: string): string => {
  // ใส่ Zero-Width Space หลังคำที่ยาวมากๆ
  return text.replace(/แป้งปลอดโปรตีน/g, "แป้งปลอด\u00ADโปรตีน");
};

const NutritionPDF: React.FC<Props> = ({
  nutritionDatas,
  portionDatas,
  caloryDatas,
  ruleDatas,
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
        {/* Title */}
        <Text style={styles.title} wrap={false}>
          ปริมาณที่ควรทานต่อวัน
        </Text>

        {/* Rule Details */}
        <Text>รายละเอียด:</Text>
        <Text>
          {ruleDatas?.DiseaseName}
          {ruleDatas?.DiseaseStage && ruleDatas.DiseaseStage !== "-"
            ? ` (${ruleDatas.DiseaseStage})`
            : ""}
          {"\u00A0\u00A0\u00A0"}
          อายุ:{" "}
          {ruleDatas?.AgeMin === 0
            ? `ไม่เกิน ${ruleDatas.AgeMax} ปี`
            : ruleDatas?.AgeMax === 200
            ? `${ruleDatas.AgeMin} ปี ขึ้นไป`
            : `${ruleDatas.AgeMin} - ${ruleDatas.AgeMax} ปี`}
          {"\u00A0\u00A0\u00A0"}
          IBW:{" "}
          {ruleDatas?.IBWMin === 0
            ? `ไม่เกิน ${ruleDatas.IBWMax} kg.`
            : ruleDatas?.IBWMax === 200
            ? `${ruleDatas.IBWMin} kg. ขึ้นไป`
            : `${ruleDatas.IBWMin} - ${ruleDatas.IBWMax} kg.`}
          {"\u00A0\u00A0\u00A0"}
        </Text>

        <Text style={{ color: 'gray' }}>
          IBW (Ideal Body Weight) = น้ำหนักมาตรฐานตามส่วนสูง (ซม.){"\u200B"} ลบ
          105 สำหรับผู้หญิง{"\u200B"} หรือ 100 สำหรับผู้ชาย.
        </Text>

        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell]}></Text>
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

        {/* Calories */}
        <Text style={styles.calories}>พลังงาน {caloryDatas} กิโลแคลอรี่</Text>

        {/* Nutrition List */}
        <View style={styles.nutritionList}>
          {nutritionDatas.map((item) => (
            <Text key={item.nutrition_group_name} style={styles.nutritionItem}>
              {item.nutrition_group_name} : {item.amount_in_grams} กรัม (
              {item.amount_in_percentage}%)
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default NutritionPDF;
