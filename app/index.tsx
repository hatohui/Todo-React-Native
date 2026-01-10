import { styles } from "@/common/styles";
import ImageViewer from "@/components/ImageViewer";
import { Link } from "expo-router";
import { Text, View } from "react-native";

const PlaceHolderImage = require("@/assets/images/background.png");

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About
      </Link>
      <View style={styles.imageContainer}>
        <ImageViewer src={PlaceHolderImage} />
      </View>
    </View>
  );
}
