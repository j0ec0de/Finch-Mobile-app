import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { cn } from '@/components/cn';
import { useTheme } from '@/hooks/use-theme';

type StatTileProps = {
  label: string;
  value: string;
  /** Percentage change vs the previous period. */
  delta?: number;
  /** Set when a rise is bad (e.g. spending). */
  invertDelta?: boolean;
};

export function StatTile({ label, value, delta, invertDelta }: StatTileProps) {
  const { colors } = useTheme();
  const up = (delta ?? 0) >= 0;
  const good = invertDelta ? !up : up;
  const color = good ? colors.statusGood : colors.statusCritical;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <View className="gap-1">
      <Text maxFontSizeMultiplier={1.5} className="text-sm text-muted-foreground">
        {label}
      </Text>
      <Text
        maxFontSizeMultiplier={1.5}
        numberOfLines={1}
        adjustsFontSizeToFit
        className="text-2xl font-semibold text-foreground tabular-nums">
        {value}
      </Text>
      {delta !== undefined ? (
        <View className="flex-row items-center gap-1">
          <Icon size={14} color={color} />
          <Text
            maxFontSizeMultiplier={1.5}
            className={cn('text-xs tabular-nums', good ? 'text-status-good' : 'text-status-critical')}>
            {`${up ? '+' : '−'}${Math.abs(delta).toFixed(1)}%`}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
