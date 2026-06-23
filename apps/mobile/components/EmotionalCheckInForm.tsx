import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  MOOD_OPTIONS,
  PRIVACY_OPTIONS,
  loadCheckIn,
  localDateKey,
  saveCheckIn,
  type CheckInPrivacy,
  type MoodId,
} from "@nucleo/core";

const NU = {
  bg: "#faf6f1",
  ink: "#1c1917",
  muted: "#57534e",
  accent: "#c4a574",
  accentStrong: "#8b6914",
};

export function EmotionalCheckInForm() {
  const today = useMemo(() => localDateKey(), []);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState<MoodId | null>(null);
  const [note, setNote] = useState("");
  const [privacy, setPrivacy] = useState<CheckInPrivacy>("all");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    loadCheckIn(today).then((existing) => {
      if (!active || !existing) return;
      setMood(existing.mood);
      setNote(existing.note);
      setPrivacy(existing.privacy);
      setSaved(true);
      setLoading(false);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [today]);

  async function handleSave() {
    if (!mood) return;
    await saveCheckIn({
      dateLocal: today,
      mood,
      note: note.trim(),
      privacy,
      updatedAt: new Date().toISOString(),
    });
    setSaved(true);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={NU.accentStrong} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Como estás hoje?</Text>
      <Text style={styles.sub}>
        {today} · Guardado neste dispositivo até ligares o Supabase.
      </Text>

      <View style={styles.moodGrid}>
        {MOOD_OPTIONS.map((opt) => {
          const selected = mood === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => setMood(opt.id)}
              style={[styles.moodBtn, selected && styles.moodBtnSelected]}
            >
              <Text style={styles.moodEmoji}>{opt.emoji}</Text>
              <Text style={styles.moodLabel}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.fieldLabel}>Observação (opcional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Algo que queiras registar…"
        placeholderTextColor={NU.muted}
        multiline
        style={styles.textArea}
        maxLength={2000}
      />

      <Text style={styles.fieldLabel}>Privacidade</Text>
      {PRIVACY_OPTIONS.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => setPrivacy(opt.value)}
          style={[styles.privacyRow, privacy === opt.value && styles.privacySelected]}
        >
          <View style={[styles.radio, privacy === opt.value && styles.radioOn]} />
          <View style={styles.privacyText}>
            <Text style={styles.privacyLabel}>{opt.label}</Text>
            <Text style={styles.privacyHint}>{opt.hint}</Text>
          </View>
        </Pressable>
      ))}

      <Pressable
        onPress={handleSave}
        disabled={!mood}
        style={[styles.saveBtn, !mood && styles.saveBtnDisabled]}
      >
        <Text style={styles.saveBtnText}>Guardar check-in</Text>
      </Pressable>
      {saved && (
        <Text style={styles.savedMsg}>Guardado neste dispositivo.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40, gap: 12 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 20, fontWeight: "600", color: NU.ink },
  sub: { fontSize: 14, color: NU.muted, marginBottom: 8 },
  moodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  moodBtn: {
    width: "30%",
    minWidth: 100,
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    backgroundColor: "#fff",
  },
  moodBtnSelected: {
    borderColor: NU.accentStrong,
    backgroundColor: "#f5ebe0",
  },
  moodEmoji: { fontSize: 28 },
  moodLabel: { fontSize: 13, fontWeight: "500", color: NU.ink, marginTop: 4 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: NU.ink, marginTop: 8 },
  textArea: {
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 12,
    padding: 12,
    minHeight: 88,
    fontSize: 14,
    color: NU.ink,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  privacyRow: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    backgroundColor: "#fff",
    marginBottom: 6,
  },
  privacySelected: { borderColor: NU.accentStrong, backgroundColor: "#faf6f1" },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: NU.muted,
    marginTop: 2,
  },
  radioOn: { borderColor: NU.accentStrong, backgroundColor: NU.accent },
  privacyText: { flex: 1 },
  privacyLabel: { fontSize: 14, fontWeight: "600", color: NU.ink },
  privacyHint: { fontSize: 12, color: NU.muted, marginTop: 2 },
  saveBtn: {
    marginTop: 12,
    backgroundColor: NU.ink,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: NU.bg, fontSize: 15, fontWeight: "600" },
  savedMsg: { textAlign: "center", color: NU.accentStrong, fontSize: 14 },
});
