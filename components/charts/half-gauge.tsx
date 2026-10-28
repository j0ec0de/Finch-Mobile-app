import Svg, { Path, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

const RADIUS = 54;
const STROKE = 10;
const CIRCUMFERENCE = Math.PI * RADIUS;
const ARC = 'M 6 60 A 54 54 0 0 1 114 60';

/** Half-ring gauge, 0-100. Same geometry as the web's financial health card. */
export function HalfGauge({ percent, label }: { percent: number; label: string }) {
  const { colors } = useTheme();
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <Svg
      viewBox="0 0 120 68"
      width={180}
      height={102}
      accessibilityRole="image"
      accessibilityLabel={label}>
      <Path d={ARC} fill="none" stroke={colors.chart[0]} strokeOpacity={0.16} strokeWidth={STROKE} strokeLinecap="round" />
      <Path
        d={ARC}
        fill="none"
        stroke={colors.chart[0]}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
      />
      <SvgText x="60" y="56" textAnchor="middle" fontSize="20" fontWeight="600" fill={colors.foreground}>
        {`${percent}%`}
      </SvgText>
    </Svg>
  );
}
