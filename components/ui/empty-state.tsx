import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center gap-3 rounded-xl border border-dashed border-border p-6">
      <View className="size-10 items-center justify-center rounded-full bg-muted">{icon}</View>
      <View className="items-center gap-1">
        <Text className="text-base font-medium text-foreground">{title}</Text>
        {description ? (
          <Text className="text-center text-sm text-muted-foreground">{description}</Text>
        ) : null}
      </View>
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}
