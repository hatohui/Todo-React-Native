import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { ArrowBackIcon, CheckmarkCircleIcon } from "../components/Icons";
import { TaskItem } from "../components/TaskItem";
import { TaskMenu } from "../components/TaskMenu";
import { Toast } from "../components/Toast";
import { useTasks } from "../context/TaskContext";
import { Task } from "../types/task";

export default function FinishedTasksScreen() {
  const router = useRouter();
  const { tasks, toggleTask, deleteTask, toggleSubtask } = useTasks();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    message: "",
    type: "success",
  });

  const completedTasks = tasks.filter((t) => t.completed);

  const handleTaskToggle = (task: Task) => {
    toggleTask(task.id);
    setToast({
      visible: true,
      message: "Task moved to active! ⚡",
      type: "success",
    });
  };

  const handleMenuPress = (task: Task) => {
    setSelectedTask(task);
    setShowMenu(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setShowDeleteConfirm(false);
      setShowMenu(false);
      setSelectedTask(null);
      setToast({
        visible: true,
        message: "Task deleted successfully",
        type: "success",
      });
    }
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
        <Text style={styles.title}>Finished Tasks</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.statsContainer}>
        <CheckmarkCircleIcon size={32} color="#10B981" strokeWidth={2} />
        <Text style={styles.statsText}>
          {completedTasks.length} task{completedTasks.length !== 1 ? "s" : ""}{" "}
          completed
        </Text>
      </View>

      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => handleTaskToggle(item)}
            onMenuPress={() => handleMenuPress(item)}
            onSubtaskToggle={(subtaskId) => toggleSubtask(item.id, subtaskId)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No completed tasks yet</Text>
            <Text style={styles.emptySubtext}>
              Complete some tasks to see them here
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {selectedTask && (
        <>
          <TaskMenu
            visible={showMenu}
            onClose={() => {
              setShowMenu(false);
              setSelectedTask(null);
            }}
            onDelete={() => {
              setShowDeleteConfirm(true);
              setShowMenu(false);
            }}
            onEdit={() => {
              setShowMenu(false);
              setSelectedTask(null);
              setToast({
                visible: true,
                message: "Editing completed tasks is not available",
                type: "error",
              });
            }}
          />
          <ConfirmationModal
            visible={showDeleteConfirm}
            title="Delete Task"
            message="Are you sure you want to permanently delete this task?"
            onConfirm={handleDeleteConfirm}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setSelectedTask(null);
            }}
          />
        </>
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
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
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  statsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
    marginLeft: 12,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#D1D5DB",
  },
});
