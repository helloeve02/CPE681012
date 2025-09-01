import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { MealPlan } from "./Mealplan";

interface MealPlanPDFProps {
  mealPlan: MealPlan;
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Sarabun",
    fontSize: 10
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  table: {
    width: "100%"
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 40
  },
  headerRow: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold"
  },
  cell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  timeCell: {
    width: 20,
    backgroundColor: "#e0e0e0"
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 10
  },
  mealText: {
    fontSize: 9,
    lineHeight: 1.2,
    marginBottom: 2
  }
});

const MealPlanPDF: React.FC<MealPlanPDFProps> = ({ mealPlan }) => {
  const timeSlots = ["เช้า", "ว่างเช้า", "กลางวัน", "ว่างบ่าย", "เย็น"];
  const days = Object.keys(mealPlan);

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>แผนการทานอาหารประจำสัปดาห์.</Text>
        
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.row, styles.headerRow]}>
            <View style={[styles.cell, styles.timeCell]}>
              <Text style={styles.headerText}>วัน</Text>
            </View>
            {timeSlots.map((timeSlot) => (
              <View key={timeSlot} style={styles.cell}>
                <Text style={styles.headerText}>{timeSlot}</Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {days.map((day) => (
            <View key={day} style={styles.row}>
              <View style={[styles.cell, styles.timeCell]}>
                <Text style={styles.headerText}>{day}</Text>
              </View>
              {timeSlots.map((timeSlot) => {
                const meals = (mealPlan as any)[day][timeSlot] || [];
                return (
                  <View key={`${day}-${timeSlot}`} style={styles.cell}>
                    {meals.length > 0 ? (
                      meals.map((meal: any, index: number) => (
                        <Text key={meal.ID || index} style={styles.mealText}>
                          {meal.PortionText}{"  "}
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
      </Page>
    </Document>
  );
};

export default MealPlanPDF;