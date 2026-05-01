import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aurora</Text>
      <Text style={styles.copy}>Mobile shell placeholder</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    color: "#4b5563",
    fontSize: 16,
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 8,
  },
});
