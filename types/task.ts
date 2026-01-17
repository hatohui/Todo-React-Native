export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
  category?: string;
  subtasks?: Subtask[];
}

export type TaskFilter = "today" | "scheduled" | "all" | "overdue";
