import { useFont } from '@shopify/react-native-skia';
import { View } from 'react-native';
import { BarGroup, CartesianChart } from 'victory-native';

import { useTheme } from '@/hooks/use-theme';

export type FlowDatum = { label: string; income: number; expenses: number };

const FONT = require('@expo-google-fonts/geist/400Regular/Geist_400Regular.ttf');

/** Grouped income / expense bars. Series colors: chart-1 income, chart-2 expenses. */
export function IncomeExpenseBars({ data, height = 200 }: { data: FlowDatum[]; height?: number }) {
  const { colors } = useTheme();
  const font = useFont(FONT, 12);
  const points = data.map((d, i) => ({ x: i, income: d.income, expenses: d.expenses }));
  // Thin the labels so they never overlap on long ranges.
  const step = Math.ceil(data.length / 7);

  return (
    <View style={{ height }}>
      <CartesianChart
        data={points}
        xKey="x"
        yKeys={['income', 'expenses']}
        domain={{ y: [0] }}
        domainPadding={{ left: 20, right: 20, top: 8 }}
        axisOptions={{
          font,
          lineWidth: { grid: { x: 0, y: 1 }, frame: 0 },
          lineColor: colors.border,
          labelColor: colors.mutedForeground,
          tickCount: { x: data.length, y: 4 },
          formatXLabel: (v) => (Number(v) % step === 0 ? (data[Number(v)]?.label ?? '') : ''),
          formatYLabel: () => '',
        }}>
        {({ points: p, chartBounds }) => (
          <BarGroup
            chartBounds={chartBounds}
            betweenGroupPadding={0.3}
            withinGroupPadding={0.08}
            roundedCorners={{ topLeft: 4, topRight: 4 }}>
            <BarGroup.Bar points={p.income} color={colors.chart[0]} />
            <BarGroup.Bar points={p.expenses} color={colors.chart[1]} />
          </BarGroup>
        )}
      </CartesianChart>
    </View>
  );
}
