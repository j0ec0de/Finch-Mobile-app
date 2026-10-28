import { ScrollView, View } from 'react-native';

/** Body of a form-sheet route: scrolls, keeps taps while the keyboard is open. */
export function SheetScreen({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      className="flex-1 bg-background"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <View className="gap-4">{children}</View>
    </ScrollView>
  );
}
