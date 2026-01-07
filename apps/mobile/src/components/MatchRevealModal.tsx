import { View, Text, Pressable, Image, Modal, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface MatchRevealModalProps {
  visible: boolean;
  matchData: {
    matchId: string;
    interactionType: string;
    eventName: string;
    otherUser: {
      id: string;
      name: string;
      profilePicture: string | null;
    };
  } | null;
  onClose: () => void;
  onSendMessage: () => void;
}

const THEME_MESSAGES: Record<string, string> = {
  fire: 'E Match! 💕',
  handshake: 'Conexao feita! 🤝',
  highfive: 'Nova amizade! ✋',
  champagne: 'Bora comemorar! 🍾',
  briefcase: 'Oportunidade! 💼',
  carona: 'Carona confirmada! 🚗',
  ticket: 'Ingresso garantido! 🎫',
  target: 'Objetivo em comum! 🎯',
};

export function MatchRevealModal({
  visible,
  matchData,
  onClose,
  onSendMessage,
}: MatchRevealModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible]);

  if (!matchData) return null;

  const matchMessage = THEME_MESSAGES[matchData.interactionType] || 'E Match! 💜';

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 items-center justify-center p-6">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          }}
          className="w-full max-w-sm"
        >
          <LinearGradient
            colors={['#7C3AED', '#D946EF', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6 items-center"
          >
            {/* Confetti decoration */}
            <View className="absolute top-4 left-4">
              <Text className="text-3xl">🎉</Text>
            </View>
            <View className="absolute top-4 right-4">
              <Text className="text-3xl">✨</Text>
            </View>

            {/* Match Title */}
            <Text className="text-white text-3xl font-bold mb-6 text-center">
              {matchMessage}
            </Text>

            {/* User Avatar */}
            <View className="relative mb-4">
              {matchData.otherUser.profilePicture ? (
                <Image
                  source={{ uri: matchData.otherUser.profilePicture }}
                  className="w-32 h-32 rounded-full border-4 border-white"
                />
              ) : (
                <View className="w-32 h-32 rounded-full bg-white/30 border-4 border-white items-center justify-center">
                  <Text className="text-white text-4xl font-bold">
                    {matchData.otherUser.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              {/* Heart decoration */}
              <View className="absolute -bottom-2 -right-2 bg-white rounded-full p-2">
                <Text className="text-2xl">💜</Text>
              </View>
            </View>

            {/* User Name */}
            <Text className="text-white text-2xl font-bold mb-2">
              {matchData.otherUser.name}
            </Text>

            {/* Event Name */}
            <View className="bg-white/20 px-4 py-2 rounded-full mb-6">
              <Text className="text-white">📍 {matchData.eventName}</Text>
            </View>

            {/* Action Buttons */}
            <View className="w-full">
              <Pressable
                onPress={onSendMessage}
                className="bg-white rounded-full py-4 mb-3"
              >
                <Text className="text-violet-600 font-bold text-lg text-center">
                  Enviar Mensagem
                </Text>
              </Pressable>

              <Pressable onPress={onClose} className="py-3">
                <Text className="text-white/80 text-center">Continuar navegando</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default MatchRevealModal;
