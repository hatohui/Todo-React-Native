import {
  BellIcon,
  CalendarIcon,
  CheckmarkCircleIcon,
  ListIcon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  TodayIcon,
} from "@/components/Icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { EditTaskModal } from "../components/EditTaskModal";
import { TaskItem } from "../components/TaskItem";
import { TaskMenu } from "../components/TaskMenu";
import { Toast } from "../components/Toast";
import { useTasks } from "../context/TaskContext";
import { Task } from "../types/task";

export default function DashboardScreen() {
  const {
    tasks,
    toggleTask,
    deleteTask,
    updateTask,
    toggleSubtask,
    isLoading,
  } = useTasks();
  const router = useRouter();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    message: "",
    type: "success",
  });

  // Filter tasks
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;

  const todayTasks = tasks.filter(
    (t) =>
      !t.completed &&
      t.dueDate &&
      t.dueDate >= todayStart &&
      t.dueDate < todayEnd,
  );

  const scheduledTasks = tasks.filter(
    (t) => !t.completed && t.dueDate && t.dueDate >= todayEnd,
  );

  const allActiveTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const displayTasks =
    todayTasks.length > 0 ? todayTasks : allActiveTasks.slice(0, 5);

  const handleTaskToggle = (task: Task) => {
    toggleTask(task.id);
    if (!task.completed) {
      setToast({
        visible: true,
        message: "Task completed! 🎉",
        type: "success",
      });
    }
  };

  const handleMenuPress = (task: Task) => {
    setSelectedTask(task);
    setShowMenu(true);
  };

  const handleDelete = () => {
    console.log("handleDelete called, selectedTask:", selectedTask);
    if (selectedTask) {
      console.log("Deleting task with id:", selectedTask.id);
      deleteTask(selectedTask.id);
      setToast({ visible: true, message: "Task deleted", type: "success" });
      setShowDeleteConfirm(false);
      setShowMenu(false);
      setSelectedTask(null);
    } else {
      console.log("No selectedTask found");
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = (updates: Partial<Task>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, updates);
      setToast({ visible: true, message: "Task updated", type: "success" });
      setShowEditModal(false);
      setSelectedTask(null);
    }
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello Jack,</Text>
            <Text style={styles.subtitle}>You have work today</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <BellIcon size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <StarIcon size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.cardsRow}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: "#DBEAFE" }]}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIcon, { backgroundColor: "#3B82F6" }]}>
                <TodayIcon size={20} color="#fff" strokeWidth={2} />
              </View>
              <Text style={styles.cardLabel}>Today</Text>
              <Text style={styles.cardCount}>{todayTasks.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { backgroundColor: "#FEF3C7" }]}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIcon, { backgroundColor: "#F59E0B" }]}>
                <CalendarIcon size={20} color="#fff" strokeWidth={2} />
              </View>
              <Text style={styles.cardLabel}>Scheduled</Text>
              <Text style={styles.cardCount}>{scheduledTasks.length}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsRow}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: "#D1FAE5" }]}
              activeOpacity={0.7}
              onPress={() => router.push("/tasklist")}
            >
              <View style={[styles.cardIcon, { backgroundColor: "#10B981" }]}>
                <ListIcon size={20} color="#fff" strokeWidth={2} />
              </View>
              <Text style={styles.cardLabel}>All</Text>
              <Text style={styles.cardCount}>{allActiveTasks.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { backgroundColor: "#D1FAE5" }]}
              activeOpacity={0.7}
              onPress={() => router.push("/finishedtasks")}
            >
              <View style={[styles.cardIcon, { backgroundColor: "#10B981" }]}>
                <CheckmarkCircleIcon size={20} color="#fff" strokeWidth={2} />
              </View>
              <Text style={styles.cardLabel}>Finished</Text>
              <Text style={styles.cardCount}>{completedTasks.length}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Tasks */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Today&apos;s Task</Text>

          {displayTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <SparklesIcon size={48} color="#D1D5DB" strokeWidth={1.5} />
              <Text style={styles.emptyText}>No tasks for today</Text>
            </View>
          ) : (
            <FlatList
              data={displayTasks}
              extraData={tasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TaskItem
                  task={item}
                  onToggle={() => handleTaskToggle(item)}
                  onMenuPress={() => handleMenuPress(item)}
                  onSubtaskToggle={(subtaskId) =>
                    toggleSubtask(item.id, subtaskId)
                  }
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => router.push("/addtask")}
        >
          <PlusIcon size={28} color="#fff" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      <TaskMenu
        visible={showMenu}
        onClose={handleCloseMenu}
        onEdit={() => {
          setShowMenu(false);
          handleEdit();
        }}
        onDelete={() => {
          setShowMenu(false);
          setShowDeleteConfirm(true);
        }}
      />

      <ConfirmationModal
        visible={showDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedTask(null);
        }}
      />

      <EditTaskModal
        visible={showEditModal}
        task={selectedTask}
        onSave={handleSaveEdit}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
      />

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  cardsContainer: {
    marginBottom: 24,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  cardCount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  tasksSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
