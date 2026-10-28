import { Text, View } from 'react-native';

import { cn } from '@/components/cn';

export function Badge({ label, className }: { label: string; className?: string }) {
  return (
    <View className={cn('h-5 justify-center self-start rounded-full bg-secondary px-2', className)}>
      <Text maxFontSizeMultiplier={1.5} className="text-xs font-medium text-secondary-foreground">
        {label}
      </Text>
    </View>
  );
}
