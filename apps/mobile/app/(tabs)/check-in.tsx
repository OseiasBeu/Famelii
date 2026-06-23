import { StyleSheet, View } from "react-native";
import { EmotionalCheckInForm } from "@/components/EmotionalCheckInForm";

export default function CheckInScreen() {
  return (
    <View style={styles.container}>
      <EmotionalCheckInForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf6f1" },
});
