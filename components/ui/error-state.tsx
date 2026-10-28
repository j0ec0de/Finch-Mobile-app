import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';

type ErrorStateProps = { error: unknown; fallback: string; onRetry?: () => void };

/** Inline load error with a retry action. */
export function ErrorState({ error, fallback, onRetry }: ErrorStateProps) {
  return (
    <View className="items-center gap-3 py-4">
      <Text className="text-center text-sm text-destructive">
        {error instanceof ApiError ? error.message : fallback}
      </Text>
      {onRetry ? <Button title="Retry" variant="outline" size="sm" onPress={onRetry} /> : null}
    </View>
  );
}
