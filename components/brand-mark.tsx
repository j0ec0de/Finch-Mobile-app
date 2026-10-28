import { PiggyBank } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function BrandMark({ showWordmark = true }: { showWordmark?: boolean }) {
  const { colors } = useTheme();

  return (
    <View accessibilityLabel="Finch" className="flex-row items-center gap-2">
      <View className="size-8 items-center justify-center rounded-lg bg-primary">
        <PiggyBank size={16} color={colors.primaryForeground} />
      </View>
      {showWordmark ? (
        <Text className="text-base font-semibold text-foreground">Finch</Text>
      ) : null}
    </View>
  );
}
