import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { MealPlan } from "./Mealplan";

interface MealPlanPDFProps {
  mealPlan: MealPlan;
}

const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Sarabun", fontSize: 12 },
  dayContainer: { marginBottom: 10 },
  dayText: { fontWeight: "bold", fontSize: 14, marginBottom: 5 },
  timeContainer: { marginLeft: 10, marginBottom: 2 },
  timeText: { fontWeight: "bold", fontSize: 12 },
  mealText: { marginLeft: 10 },
});

const MealPlanPDF: React.FC<MealPlanPDFProps> = ({ mealPlan }) => (
  <Document>
    <Page style={styles.page}>
      {Object.entries(mealPlan).map(([day, mealsByTime]) => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayText}>{day}</Text>
          {Object.entries(mealsByTime).map(([time, meals]: [string, any[]]) => (
            <View key={time} style={styles.timeContainer}>
              <Text style={styles.timeText}>{time}:</Text>
              {meals.map((meal) => (
                <Text key={meal.ID} style={styles.mealText}>
                  - {meal.PortionText}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default MealPlanPDF;
