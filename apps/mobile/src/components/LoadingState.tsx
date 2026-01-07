import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <ActivityIndicator size="large" color="#7C3AED" />
      {message && (
        <Text className="text-gray-500 mt-4">{message}</Text>
      )}
    </View>
  );
}

export default LoadingState;
