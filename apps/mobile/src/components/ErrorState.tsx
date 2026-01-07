import { View, Text, Pressable } from 'react-native';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Ops! Algo deu errado',
  message = 'Não foi possível carregar os dados. Verifique sua conexão e tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20 px-8">
      <Text className="text-6xl mb-4">😕</Text>
      <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-500 text-center mb-6">{message}</Text>
      {onRetry && (
        <Pressable
          className="bg-violet-600 px-6 py-3 rounded-full active:bg-violet-700"
          onPress={onRetry}
        >
          <Text className="text-white font-medium">Tentar novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

export default ErrorState;
