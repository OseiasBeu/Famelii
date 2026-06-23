import { SymbolView } from "expo-symbols";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Centro",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "house.fill", android: "home", web: "home" }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="check-in"
        options={{
          title: "Check-in",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "heart.fill", android: "favorite", web: "favorite" }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="missoes"
        options={{
          title: "Missões",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "checklist",
                android: "checklist",
                web: "checklist",
              }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="financas"
        options={{
          title: "Finanças",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "eurosign.circle",
                android: "payments",
                web: "payments",
              }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
