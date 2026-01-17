import { Stack } from "expo-router";
import { TaskProvider } from "../context/TaskContext";

export default function RootLayout() {
  return (
    <TaskProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="tasklist" />
        <Stack.Screen name="finishedtasks" />
        <Stack.Screen name="addtask" options={{ presentation: "modal" }} />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </TaskProvider>
  );
}
