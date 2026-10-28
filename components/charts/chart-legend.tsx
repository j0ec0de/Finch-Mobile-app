import { Text, View } from 'react-native';

export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <View className="flex-row justify-center gap-4">
      {items.map((i) => (
        <View key={i.label} className="flex-row items-center gap-1.5">
          <View style={{ backgroundColor: i.color }} className="size-2.5 rounded-full" />
          <Text maxFontSizeMultiplier={1.5} className="text-xs text-muted-foreground">
            {i.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
