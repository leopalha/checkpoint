import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';

interface PremiumPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  features: string[];
}

interface CreditsPackage {
  id: string;
  credits: number;
  price: number;
  currency: string;
  isBestValue: boolean;
}

interface PremiumStatus {
  isPremium: boolean;
  dailyLikesRemaining: number;
  dailyLikesTotal: number;
  dailyLikesResetAt: string;
  creditsBalance: number;
  premiumExpiresAt: string | null;
}

export default function PremiumScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [status, setStatus] = useState<PremiumStatus | null>(null);
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [packages, setPackages] = useState<CreditsPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statusRes, plansRes, packagesRes] = await Promise.all([
        api.get('/premium/status'),
        api.get('/premium/plans'),
        api.get('/premium/credits/packages'),
      ]);
      setStatus(statusRes.data);
      setPlans(plansRes.data.plans);
      setPackages(packagesRes.data.packages);
    } catch (error) {
      console.error('Failed to fetch premium data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setPurchasing(true);
    try {
      await api.post('/premium/subscribe', { planId });
      await fetchData();
      // Show success message
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setPurchasing(false);
    }
  };

  const handlePurchaseCredits = async (amount: number) => {
    setPurchasing(true);
    try {
      await api.post('/premium/credits/purchase', { amount });
      await fetchData();
    } catch (error) {
      console.error('Failed to purchase credits:', error);
    } finally {
      setPurchasing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <LinearGradient
          colors={['#7C3AED', '#D946EF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pt-4 pb-8"
        >
          <View className="flex-row items-center mb-6">
            <Pressable onPress={() => router.back()} className="mr-4">
              <Text className="text-white text-2xl">{'<'}</Text>
            </Pressable>
            <Text className="text-white text-xl font-bold">Premium</Text>
          </View>

          {status?.isPremium ? (
            <View className="bg-white/20 rounded-2xl p-4">
              <View className="flex-row items-center">
                <Text className="text-3xl mr-2">👑</Text>
                <View>
                  <Text className="text-white font-bold text-lg">Voce e Premium!</Text>
                  <Text className="text-white/80">Curtidas ilimitadas ativadas</Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text className="text-white text-3xl font-bold mb-2">Upgrade para Premium</Text>
              <Text className="text-white/80 text-lg">
                Desbloqueie curtidas ilimitadas e recursos exclusivos
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Current Status */}
        <View className="px-6 -mt-4">
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <Text className="text-gray-500 text-sm mb-2">Suas curtidas hoje</Text>
            <View className="flex-row items-end justify-between">
              <Text className="text-3xl font-bold text-gray-900">
                {status?.dailyLikesRemaining || 0}
                <Text className="text-lg text-gray-400"> / {status?.dailyLikesTotal || 10}</Text>
              </Text>
              <Text className="text-violet-600 font-medium">
                {status?.isPremium ? 'Ilimitado' : 'Gratis'}
              </Text>
            </View>
            {/* Progress bar */}
            <View className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <View
                className="h-full bg-violet-600 rounded-full"
                style={{
                  width: `${Math.min(100, ((status?.dailyLikesRemaining || 0) / (status?.dailyLikesTotal || 10)) * 100)}%`,
                }}
              />
            </View>
          </View>
        </View>

        {/* Premium Plans */}
        {!status?.isPremium && (
          <View className="px-6 mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Planos Premium</Text>

            {plans.map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                className={`bg-white rounded-2xl p-4 mb-3 border-2 ${
                  selectedPlan === plan.id ? 'border-violet-600' : 'border-transparent'
                }`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View>
                    <Text className="text-lg font-bold text-gray-900">{plan.name}</Text>
                    <Text className="text-gray-500 text-sm">{plan.description}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-violet-600">
                      {formatPrice(plan.price)}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      {plan.durationDays} dias
                    </Text>
                  </View>
                </View>

                <View className="border-t border-gray-100 pt-3 mt-2">
                  {plan.features.map((feature, index) => (
                    <View key={index} className="flex-row items-center mb-1">
                      <Text className="text-green-500 mr-2">✓</Text>
                      <Text className="text-gray-600">{feature}</Text>
                    </View>
                  ))}
                </View>

                {plan.id === 'quarterly' && (
                  <View className="absolute -top-2 -right-2 bg-amber-400 px-2 py-1 rounded-full">
                    <Text className="text-xs font-bold text-amber-900">MELHOR CUSTO</Text>
                  </View>
                )}
              </Pressable>
            ))}

            {selectedPlan && (
              <Pressable
                onPress={() => handleSubscribe(selectedPlan)}
                disabled={purchasing}
                className="mt-4"
              >
                <LinearGradient
                  colors={['#7C3AED', '#D946EF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-full py-4 items-center"
                >
                  {purchasing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold text-lg">Assinar Agora</Text>
                  )}
                </LinearGradient>
              </Pressable>
            )}
          </View>
        )}

        {/* Credits Packages */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-2">Comprar Curtidas Avulsas</Text>
          <Text className="text-gray-500 mb-4">Adicione mais curtidas sem assinar</Text>

          <View className="flex-row flex-wrap -mx-2">
            {packages.map((pkg) => (
              <View key={pkg.id} className="w-1/2 px-2 mb-4">
                <Pressable
                  onPress={() => handlePurchaseCredits(pkg.credits)}
                  disabled={purchasing}
                  className={`bg-white rounded-xl p-4 items-center border-2 ${
                    pkg.isBestValue ? 'border-amber-400' : 'border-transparent'
                  }`}
                >
                  {pkg.isBestValue && (
                    <View className="absolute -top-2 bg-amber-400 px-2 py-0.5 rounded-full">
                      <Text className="text-xs font-bold text-amber-900">POPULAR</Text>
                    </View>
                  )}
                  <Text className="text-3xl mb-2">💜</Text>
                  <Text className="text-2xl font-bold text-gray-900">{pkg.credits}</Text>
                  <Text className="text-gray-500 text-sm mb-2">curtidas</Text>
                  <Text className="text-violet-600 font-bold">{formatPrice(pkg.price)}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Benefits Section */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Beneficios Premium</Text>

          <View className="bg-white rounded-2xl p-4">
            {[
              { emoji: '💜', title: 'Curtidas Ilimitadas', desc: 'Sem limite diario de curtidas' },
              { emoji: '👀', title: 'Ver Quem Curtiu', desc: 'Saiba quem se interessou por voce' },
              { emoji: '👻', title: 'Modo Fantasma', desc: 'Navegue sem ser visto' },
              { emoji: '⭐', title: 'Destaque', desc: 'Apareca primeiro nas listas' },
              { emoji: '🎯', title: 'Prioridade', desc: 'Suporte prioritario' },
            ].map((benefit, index) => (
              <View
                key={index}
                className={`flex-row items-center py-3 ${
                  index !== 4 ? 'border-b border-gray-100' : ''
                }`}
              >
                <Text className="text-2xl mr-4">{benefit.emoji}</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">{benefit.title}</Text>
                  <Text className="text-gray-500 text-sm">{benefit.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
