import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Task } from "../types/task";
import { storage } from "../utils/storage";

interface TaskContextType {
  tasks: Task[];
  addTask: (text: string, dueDate?: number, category?: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Persist tasks whenever they change
  useEffect(() => {
    console.log(
      "useEffect triggered - isLoading:",
      isLoading,
      "tasks count:",
      tasks.length,
    );
    if (!isLoading) {
      console.log("Calling storage.saveTasks");
      storage.saveTasks(tasks);
    } else {
      console.log("Skipping save - still loading");
    }
  }, [tasks, isLoading]);

  const loadTasks = async () => {
    const loadedTasks = await storage.getTasks();
    setTasks(loadedTasks);
    setIsLoading(false);
  };

  const addTask = (text: string, dueDate?: number, category?: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now(),
      dueDate,
      category,
      subtasks: [],
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    console.log(
      "TaskContext updateTask called with id:",
      id,
      "updates:",
      JSON.stringify(updates),
    );
    setTasks((prev) => {
      const taskToUpdate = prev.find((task) => task.id === id);
      console.log("Task before update:", JSON.stringify(taskToUpdate));

      const updated = prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task,
      );

      const updatedTask = updated.find((task) => task.id === id);
      console.log("Task after update:", JSON.stringify(updatedTask));
      console.log("Tasks updated, new count:", updated.length);

      return updated;
    });
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    console.log("TaskContext deleteTask called with id:", id);
    console.log("Current tasks count:", tasks.length);
    setTasks((prev) => {
      const filtered = prev.filter((task) => task.id !== id);
      console.log("After delete, tasks count:", filtered.length);
      return filtered;
    });
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId && task.subtasks) {
          return {
            ...task,
            subtasks: task.subtasks.map((subtask) =>
              subtask.id === subtaskId
                ? { ...subtask, completed: !subtask.completed }
                : subtask,
            ),
          };
        }
        return task;
      }),
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        toggleSubtask,
        isLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
