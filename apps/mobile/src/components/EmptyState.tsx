import { View, Text, Pressable } from 'react-native';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  emoji = '📭',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20 px-8">
      <Text className="text-6xl mb-4">{emoji}</Text>
      <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-500 text-center mb-6">{message}</Text>
      {actionLabel && onAction && (
        <Pressable
          className="bg-violet-600 px-6 py-3 rounded-full active:bg-violet-700"
          onPress={onAction}
        >
          <Text className="text-white font-medium">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

export default EmptyState;
