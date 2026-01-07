import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

const FAQ = [
  {
    question: 'Como funciona o CheckPoint?',
    answer:
      'O CheckPoint conecta pessoas em eventos presenciais. Confirme sua presença, faça check-in no local e interaja com outros participantes. Quando há interesse mútuo, vocês fazem match!',
  },
  {
    question: 'Como faço check-in em um evento?',
    answer:
      'Você pode fazer check-in de duas formas: por GPS (automático quando você está no local) ou escaneando o QR Code do organizador.',
  },
  {
    question: 'O que são as "intenções"?',
    answer:
      'Intenções indicam o que você busca no evento: paquera, networking, amizade, carona, etc. Isso ajuda outros participantes a entenderem seus interesses.',
  },
  {
    question: 'Como funciona o match?',
    answer:
      'Quando duas pessoas demonstram interesse mútuo através das interações, acontece um match! Porém, o match só é revelado quando ambos fazem check-in no evento.',
  },
  {
    question: 'Por que preciso fazer check-in para ver o match?',
    answer:
      'Isso garante que vocês estejam realmente no mesmo evento, incentivando a interação presencial ao invés de apenas online.',
  },
  {
    question: 'O chat tem tempo limite?',
    answer:
      'Sim! As conversas expiram após o fim do evento para incentivar conexões genuínas. Vocês podem trocar contatos (Instagram) antes do chat expirar.',
  },
  {
    question: 'Quantas curtidas posso enviar por dia?',
    answer:
      'Usuários gratuitos podem enviar até 10 interações por dia. Usuários Premium têm interações ilimitadas.',
  },
  {
    question: 'O que o Premium oferece?',
    answer:
      'Com Premium você tem interações ilimitadas, pode ver quem te curtiu antes de curtir de volta, e acessa estatísticas avançadas.',
  },
];

export default function HelpScreen() {
  const handleContact = () => {
    Linking.openURL('mailto:suporte@checkpoint.app?subject=Ajuda%20CheckPoint');
  };

  const handleInstagram = () => {
    Linking.openURL('https://instagram.com/checkpoint.app');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Ajuda',
          headerBackTitle: 'Voltar',
        }}
      />
      <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
        <ScrollView>
          {/* FAQ Section */}
          <View className="mt-6">
            <Text className="px-6 text-sm font-medium text-gray-500 uppercase mb-2">
              Perguntas Frequentes
            </Text>
            <View className="bg-white">
              {FAQ.map((item, index) => (
                <View
                  key={index}
                  className={`px-6 py-4 ${
                    index < FAQ.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <Text className="text-gray-900 font-medium">{item.question}</Text>
                  <Text className="text-gray-600 mt-2 leading-6">{item.answer}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Contact Section */}
          <View className="mt-6 mb-8">
            <Text className="px-6 text-sm font-medium text-gray-500 uppercase mb-2">
              Contato
            </Text>
            <View className="bg-white">
              <Pressable
                className="px-6 py-4 flex-row items-center border-b border-gray-100"
                onPress={handleContact}
              >
                <Text className="text-2xl mr-3">📧</Text>
                <View>
                  <Text className="text-gray-900 font-medium">Email</Text>
                  <Text className="text-gray-500 text-sm">suporte@checkpoint.app</Text>
                </View>
              </Pressable>
              <Pressable
                className="px-6 py-4 flex-row items-center"
                onPress={handleInstagram}
              >
                <Text className="text-2xl mr-3">📸</Text>
                <View>
                  <Text className="text-gray-900 font-medium">Instagram</Text>
                  <Text className="text-gray-500 text-sm">@checkpoint.app</Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* App Info */}
          <View className="items-center pb-8">
            <Text className="text-5xl mb-2">💜</Text>
            <Text className="text-gray-900 font-bold text-lg">CheckPoint</Text>
            <Text className="text-gray-500">Versão 0.1.0</Text>
            <Text className="text-gray-400 text-sm mt-2">
              Feito com amor no Brasil
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
