import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CalendarIcon,
  CloseCircleIcon,
  CloseIcon,
  PlusCircleIcon,
} from "../components/Icons";
import { useTasks } from "../context/TaskContext";
import { Subtask } from "../types/task";

const CATEGORIES = [
  "Grocery",
  "Educational",
  "Home Related",
  "Work Related",
  "Mandatory Work",
  "Personal Notes",
];

export default function AddTaskScreen() {
  const router = useRouter();
  const { addTask } = useTasks();

  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;

    const subtask: Subtask = {
      id: Date.now().toString(),
      text: newSubtask.trim(),
      completed: false,
    };

    setSubtasks([...subtasks, subtask]);
    setNewSubtask("");
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSave = () => {
    if (!taskText.trim()) return;

    // Create the task with addTask
    addTask(taskText.trim(), dueDate.getTime(), selectedCategory || undefined);

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <CloseIcon size={28} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Task</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Task Name *</Text>
          <TextInput
            style={styles.input}
            value={taskText}
            onChangeText={setTaskText}
            placeholder="Enter task name"
            placeholderTextColor="#9CA3AF"
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Due Date & Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <CalendarIcon size={20} color="#6B7280" strokeWidth={2} />
            <Text style={styles.dateText}>
              {dueDate.toLocaleDateString()}{" "}
              {dueDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && Platform.OS === "ios" && (
            <DateTimePicker
              value={dueDate}
              mode="datetime"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
                setShowDatePicker(false);
              }}
            />
          )}

          {showDatePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={dueDate}
              mode="datetime"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (event.type === "set" && selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipSelected,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    category === selectedCategory ? "" : category,
                  )
                }
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category &&
                      styles.categoryChipTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Subtasks</Text>
          {subtasks.map((subtask) => (
            <View key={subtask.id} style={styles.subtaskItem}>
              <Text style={styles.subtaskText}>{subtask.text}</Text>
              <TouchableOpacity onPress={() => removeSubtask(subtask.id)}>
                <CloseCircleIcon size={20} color="#EF4444" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.addSubtaskContainer}>
            <TextInput
              style={styles.subtaskInput}
              value={newSubtask}
              onChangeText={setNewSubtask}
              placeholder="Add subtask"
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={handleAddSubtask}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={handleAddSubtask}
              style={styles.addSubtaskButton}
            >
              <PlusCircleIcon size={28} color="#3B82F6" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
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
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 60,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dateText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
  categoriesContainer: {
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  categoryChipTextSelected: {
    color: "#fff",
  },
  subtaskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  subtaskText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
  },
  addSubtaskContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtaskInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  addSubtaskButton: {
    padding: 2,
  },
});
