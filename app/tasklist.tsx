import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowBackIcon, ArrowRightIcon } from "../components/Icons";
import { useTasks } from "../context/TaskContext";

const CATEGORIES = [
  { name: "Grocery", color: "#E9D5FF", textColor: "#7C3AED" },
  { name: "Educational", color: "#BFDBFE", textColor: "#2563EB" },
  { name: "Home Related", color: "#FEF08A", textColor: "#CA8A04" },
  { name: "Work Related", color: "#86EFAC", textColor: "#16A34A" },
  { name: "Mandatory Work", color: "#F9A8D4", textColor: "#DB2777" },
  { name: "Personal Notes", color: "#BAE6FD", textColor: "#0284C7" },
];

export default function TaskListScreen() {
  const router = useRouter();
  const { tasks } = useTasks();

  const getCategoryStats = (category: string) => {
    const categoryTasks = tasks.filter((t) => t.category === category);
    const completed = categoryTasks.filter((t) => t.completed).length;
    const total = categoryTasks.length;
    return { completed, total };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowBackIcon size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>All Task List</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const stats = getCategoryStats(category.name);
          return (
            <TouchableOpacity
              key={category.name}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.categoryName, { color: category.textColor }]}
              >
                {category.name}
              </Text>
              <Text style={styles.completedText}>
                {stats.completed} Completed
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.notesText}>{stats.total} Notes</Text>
                <ArrowRightIcon
                  size={20}
                  color={category.textColor}
                  strokeWidth={2}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  completedText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notesText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
});
