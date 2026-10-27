import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Task = { id: string; title: string; done: boolean };

export default function HomeScreen() {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Try my first app', done: true },
    { id: '2', title: 'Add a new task', done: false },
  ]);

  const addTask = () => {
    const title = text.trim();
    if (!title) return;
    setTasks((prev) => [{ id: Date.now().toString(), title, done: false }, ...prev]);
    setText('');
  };

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome Joel!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedText style={styles.subtitle}>
          {remaining} {remaining === 1 ? 'task' : 'tasks'} left
        </ThemedText>

        <ThemedView style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="New task..."
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <Pressable style={styles.addButton} onPress={addTask}>
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </Pressable>
        </ThemedView>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<ThemedText style={styles.empty}>No tasks yet.</ThemedText>}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => toggleTask(item.id)}>
              <ThemedText style={styles.check}>{item.done ? '✅' : '⬜'}</ThemedText>
              <ThemedText style={item.done ? styles.done : undefined}>{item.title}</ThemedText>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: { marginTop: 4, marginBottom: 16, opacity: 0.6 },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
  list: { gap: 10, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9993',
  },
  check: { fontSize: 18 },
  done: { textDecorationLine: 'line-through', opacity: 0.5 },
  empty: { textAlign: 'center', opacity: 0.5, marginTop: 24 },
});
