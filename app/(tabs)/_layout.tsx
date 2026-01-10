import { icons } from "@/common/icons";
import { tabStyle } from "@/common/tabs-style";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={tabStyle}>
      <Tabs.Screen
        name="/"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => icons.Home(color, focused),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => icons.About(color, focused),
        }}
      />
    </Tabs>
  );
}
