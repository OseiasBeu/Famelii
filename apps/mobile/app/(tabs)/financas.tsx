import { StyleSheet, View } from "react-native";
import { FinanceMvpPanel } from "@/components/FinanceMvpPanel";

export default function FinancasScreen() {
  return (
    <View style={styles.container}>
      <FinanceMvpPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf6f1" },
});
