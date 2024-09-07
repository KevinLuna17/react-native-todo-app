import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Task } from "./components/Task";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const response = await fetch("http://192.168.100.4:8080/todos/1");

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      // Manejar el error, por ejemplo, mostrar un mensaje en la consola
      console.error("Error fetching todos:", error);
    }
  }

  function clearTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: todo.completed === 1 ? 0 : 1 }
          : todo
      )
    );
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <StatusBar style="auto" />
        <SafeAreaView style={styles.container}>
          <FlatList
            data={todos}
            contentContainerStyle={styles.contentContainerStyle}
            keyExtractor={(todo) => todo.id}
            renderItem={({ item }) => (
              <Task {...item} toggleTodo={toggleTodo} clearTodo={clearTodo} />
            )}
            ListHeaderComponent={<Text style={styles.titleHeader}>Today</Text>}
          />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E9EF",
  },
  contentContainerStyle: {
    padding: 15,
  },
  titleHeader: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 15,
  },
});
