import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenProps = {
  title: string;
  action?: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
  children?: React.ReactNode;
};

/** Standard tab screen: safe-area aware, 16pt gutter, 16pt gap between sections. */
export function Screen({ title, action, refreshing = false, onRefresh, children }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
      }
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24 }}>
      <View className="w-full max-w-[640px] gap-4 self-center px-4">
        <View className="flex-row items-center justify-between">
          <Text accessibilityRole="header" className="text-xl font-medium text-foreground">
            {title}
          </Text>
          {action}
        </View>
        {children}
      </View>
    </ScrollView>
  );
}
