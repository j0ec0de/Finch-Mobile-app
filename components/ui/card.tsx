import { Text, View, type ViewProps } from 'react-native';

import { cn } from '@/components/cn';

type CardProps = ViewProps & { title?: string; action?: React.ReactNode; compact?: boolean };

export function Card({ title, action, compact, className, children, ...props }: CardProps) {
  return (
    <View
      className={cn('rounded-xl border border-border bg-card', compact ? 'p-3' : 'p-4', className)}
      {...props}>
      {title || action ? (
        <View className="mb-3 flex-row items-center justify-between">
          {title ? (
            <Text accessibilityRole="header" className="text-base font-medium text-card-foreground">
              {title}
            </Text>
          ) : null}
          {action}
        </View>
      ) : null}
      {children}
    </View>
  );
}
