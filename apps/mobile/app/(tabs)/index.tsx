import { StyleSheet, Text, View } from "react-native";
import { localDateKey } from "@nucleo/core";

const NU = { bg: "#faf6f1", ink: "#1c1917", muted: "#57534e" };

export default function CentroScreen() {
  const today = localDateKey();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Centro de comando</Text>
      <Text style={styles.sub}>
        Resumo do dia ({today}). Núcleo — iOS, Android e Web.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fase 1</Text>
        <Text style={styles.cardBody}>
          Check-in, missões, calendário e finanças (tutores) a ligar ao Supabase.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: NU.bg,
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: "700", color: NU.ink },
  sub: { fontSize: 14, color: NU.muted, lineHeight: 20 },
  card: {
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: NU.ink },
  cardBody: { fontSize: 14, color: NU.muted, marginTop: 6, lineHeight: 20 },
});
