import { Text, View } from 'react-native';

import { cn } from '@/components/cn';

type MeterProps = {
  value: number;
  max: number;
  leftLabel?: string;
  rightLabel?: string;
};

/** Budget / goal progress. Over 100% turns critical. */
export function Meter({ value, max, leftLabel, rightLabel }: MeterProps) {
  const ratio = max > 0 ? value / max : 0;
  const over = ratio > 1;
  const percent = Math.round(Math.min(Math.max(ratio, 0), 1) * 100);

  return (
    <View className="gap-1.5">
      {leftLabel || rightLabel ? (
        <View className="flex-row justify-between">
          <Text maxFontSizeMultiplier={1.5} className="text-sm text-muted-foreground tabular-nums">
            {leftLabel}
          </Text>
          <Text maxFontSizeMultiplier={1.5} className="text-sm text-muted-foreground tabular-nums">
            {rightLabel}
          </Text>
        </View>
      ) : null}
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: percent }}
        className="h-2 overflow-hidden rounded-full bg-chart-1/15">
        <View
          style={{ width: `${percent}%` }}
          className={cn('h-full rounded-full', over ? 'bg-status-critical' : 'bg-chart-1')}
        />
      </View>
    </View>
  );
}
