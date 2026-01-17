import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Task } from "../types/task";
import { CalendarIcon, CheckmarkIcon, ClockIcon, MenuDotsIcon } from "./Icons";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onMenuPress: () => void;
  onSubtaskToggle?: (subtaskId: string) => void;
}

export const TaskItem = ({
  task,
  onToggle,
  onMenuPress,
  onSubtaskToggle,
}: TaskItemProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View
          style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        >
          {task.completed && (
            <CheckmarkIcon size={16} color="#fff" strokeWidth={3} />
          )}
        </View>

        <View style={styles.textContainer}>
          {task.dueDate && (
            <View style={styles.dateTimeContainer}>
              <CalendarIcon size={14} color="#9CA3AF" strokeWidth={2} />
              <Text style={styles.timeText}>{formatDate(task.dueDate)}</Text>
              <ClockIcon size={14} color="#9CA3AF" strokeWidth={2} />
              <Text style={styles.timeText}>{formatTime(task.dueDate)}</Text>
            </View>
          )}
          <Text
            style={[
              styles.taskText,
              task.completed && styles.taskTextCompleted,
            ]}
            numberOfLines={2}
          >
            {task.text}
          </Text>

          {task.subtasks && task.subtasks.length > 0 && (
            <View style={styles.subtasksContainer}>
              {task.subtasks.slice(0, 3).map((subtask) => (
                <TouchableOpacity
                  key={subtask.id}
                  style={styles.subtaskItem}
                  onPress={() => onSubtaskToggle?.(subtask.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.subtaskCheckbox,
                      subtask.completed && styles.subtaskCheckboxCompleted,
                    ]}
                  >
                    {subtask.completed && (
                      <CheckmarkIcon size={10} color="#fff" strokeWidth={2} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.subtaskText,
                      subtask.completed && styles.subtaskTextCompleted,
                    ]}
                  >
                    {subtask.text}
                  </Text>
                </TouchableOpacity>
              ))}
              {task.subtasks.length > 3 && (
                <Text style={styles.moreSubtasks}>
                  +{task.subtasks.length - 3} more
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
        activeOpacity={0.7}
      >
        <MenuDotsIcon size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#edf1f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  textContainer: {
    flex: 1,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  taskText: {
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 22,
  },
  taskTextCompleted: {
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  subtasksContainer: {
    marginTop: 8,
    paddingLeft: 8,
  },
  subtaskItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  subtaskCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  subtaskCheckboxCompleted: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  subtaskText: {
    fontSize: 14,
    color: "#6B7280",
  },
  subtaskTextCompleted: {
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  moreSubtasks: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginTop: 4,
    marginLeft: 24,
  },
  menuButton: {
    padding: 8,
    marginTop: -4,
  },
});
