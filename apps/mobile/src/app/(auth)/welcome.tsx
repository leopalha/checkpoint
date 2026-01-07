import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-violet-600 items-center justify-center px-8">
      {/* Logo */}
      <View className="items-center mb-12">
        <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center mb-6">
          <Text className="text-5xl">📍</Text>
        </View>
        <Text className="text-white text-4xl font-bold">CheckPoint</Text>
        <Text className="text-violet-200 text-center mt-4 text-lg">
          Descubra quem está onde.{'\n'}Conecte-se com intenção.
        </Text>
      </View>

      {/* Login Button */}
      <Link href="/(auth)/instagram-login" asChild>
        <Pressable className="bg-white w-full py-4 rounded-2xl items-center flex-row justify-center">
          <Text className="text-2xl mr-3">📸</Text>
          <Text className="text-violet-600 font-semibold text-lg">
            Entrar com Instagram
          </Text>
        </Pressable>
      </Link>

      {/* Terms */}
      <Text className="text-violet-200 text-center mt-8 text-sm">
        Ao continuar, você concorda com nossos{' '}
        <Text className="underline">Termos de Uso</Text> e{' '}
        <Text className="underline">Política de Privacidade</Text>
      </Text>
    </View>
  );
}
