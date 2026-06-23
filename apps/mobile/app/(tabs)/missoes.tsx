import { StyleSheet, Text, View } from "react-native";

const NU = { bg: "#faf6f1", ink: "#1c1917", muted: "#57534e" };

export default function MissoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Missões</Text>
      <Text style={styles.sub}>Stub — tarefas familiares (brief §13).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: NU.bg },
  title: { fontSize: 22, fontWeight: "700", color: NU.ink },
  sub: { fontSize: 14, color: NU.muted, marginTop: 8 },
});
