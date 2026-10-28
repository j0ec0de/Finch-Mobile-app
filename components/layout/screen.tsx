import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenProps = { title: string; children?: React.ReactNode };

/** Standard tab screen: safe-area aware, 16pt gutter, 16pt gap between sections. */
export function Screen({ title, children }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24 }}>
      <View className="w-full max-w-[640px] gap-4 self-center px-4">
        <Text accessibilityRole="header" className="text-xl font-medium text-foreground">
          {title}
        </Text>
        {children}
      </View>
    </ScrollView>
  );
}
