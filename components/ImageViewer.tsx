import { styles } from "@/common/styles";
import { Image } from "expo-image";
import { ImageSourcePropType } from "react-native";

type ImageViewerProps = {
  src: ImageSourcePropType;
};

const ImageViewer = ({ src }: ImageViewerProps) => {
  return <Image source={src} style={styles.image} />;
};

export default ImageViewer;
