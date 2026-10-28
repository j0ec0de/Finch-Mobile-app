import { Pressable, Text, View } from 'react-native';

import { cn } from '@/components/cn';

type ListRowProps = {
  title: string;
  subtitle?: string;
  /** Pre-formatted amount, including its sign. */
  amount?: string;
  tone?: 'income' | 'expense' | 'neutral';
  icon?: React.ReactNode;
  accessibilityHint?: string;
  onPress?: () => void;
};

const toneClass = {
  income: 'text-status-good',
  expense: 'text-status-critical',
  neutral: 'text-foreground',
} as const;

const toneLabel = { income: 'income', expense: 'expense', neutral: 'transfer' } as const;

export function ListRow({
  title,
  subtitle,
  amount,
  tone = 'neutral',
  icon,
  accessibilityHint,
  onPress,
}: ListRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={[title, subtitle, amount && `${toneLabel[tone]} ${amount}`]
        .filter(Boolean)
        .join(', ')}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      className="min-h-14 flex-row items-center gap-3 px-4 py-2 active:bg-muted">
      {icon ? (
        <View className="size-9 items-center justify-center rounded-lg bg-muted">{icon}</View>
      ) : null}
      <View className="flex-1">
        <Text maxFontSizeMultiplier={1.5} numberOfLines={1} className="text-base text-foreground">
          {title}
        </Text>
        {subtitle ? (
          <Text
            maxFontSizeMultiplier={1.5}
            numberOfLines={1}
            className="text-sm text-muted-foreground">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {amount ? (
        <Text
          maxFontSizeMultiplier={1.5}
          className={cn('text-base font-medium tabular-nums', toneClass[tone])}>
          {amount}
        </Text>
      ) : null}
    </Pressable>
  );
}
