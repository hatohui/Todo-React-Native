import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/task";

const STORAGE_KEY = "@todo_tasks";

export const storage = {
  async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(STORAGE_KEY);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error("Failed to load tasks:", error);
      return [];
    }
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      console.log("Saving tasks to AsyncStorage, count:", tasks.length);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      console.log("Tasks saved successfully");
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  },
};
