import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Subtask, Task } from "../types/task";
import {
  CalendarIcon,
  CloseCircleIcon,
  CloseIcon,
  PlusCircleIcon,
} from "./Icons";

interface EditTaskModalProps {
  visible: boolean;
  task: Task | null;
  onSave: (updates: Partial<Task>) => void;
  onClose: () => void;
}

export const EditTaskModal = ({
  visible,
  task,
  onSave,
  onClose,
}: EditTaskModalProps) => {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    if (task) {
      setText(task.text);
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  const handleSave = () => {
    if (!text.trim()) return;

    onSave({
      text: text.trim(),
      dueDate: dueDate?.getTime(),
      subtasks,
    });
    onClose();
  };

  const addSubtask = () => {
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CloseIcon size={28} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Task</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Task Name</Text>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Enter task name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon size={20} color="#6B7280" />
              <Text style={styles.dateText}>
                {dueDate
                  ? dueDate.toLocaleDateString() +
                    " " +
                    dueDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select date & time"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate || new Date()}
                mode="datetime"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === "android") {
                    setShowDatePicker(false);
                  }
                  if (selectedDate) {
                    setDueDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Subtasks</Text>
            {subtasks.map((subtask) => (
              <View key={subtask.id} style={styles.subtaskItem}>
                <Text style={styles.subtaskText}>{subtask.text}</Text>
                <TouchableOpacity onPress={() => removeSubtask(subtask.id)}>
                  <CloseCircleIcon size={20} color="#EF4444" />
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
                onSubmitEditing={addSubtask}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={addSubtask}
                style={styles.addSubtaskButton}
              >
                <PlusCircleIcon size={28} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

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
    paddingTop: 60,
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
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
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
  subtaskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
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
    padding: 12,
    fontSize: 15,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  addSubtaskButton: {
    padding: 4,
  },
});
