import { styles } from "@/common/styles";
import { Pressable, Text, View } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
}

const Button = ({ label, onPress }: ButtonProps) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
};
