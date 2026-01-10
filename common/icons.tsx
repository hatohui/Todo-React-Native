import Ionicons from "@expo/vector-icons/Ionicons";

const HomeIcon = (color: string, focused: boolean) => (
  <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
);

const AboutIcon = (color: string, focused: boolean) => (
  <Ionicons
    name={focused ? "information-circle" : "information-circle-outline"}
    color={color}
    size={24}
  />
);

export const icons = {
  Home: (color: string, focused: boolean) => HomeIcon(color, focused),
  About: (color: string, focused: boolean) => AboutIcon(color, focused),
};
