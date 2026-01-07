import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { api } from '../../../services/api';

export default function QRCheckInScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned || processing) return;

    setScanned(true);
    setProcessing(true);

    try {
      // QR code data should be the event's qrCode value
      await api.post('/presence/check-in/qr', {
        eventId: id,
        qrCode: data,
      });

      Alert.alert(
        'Check-in realizado!',
        'Você fez check-in com sucesso. Agora pode interagir com outros participantes.',
        [
          {
            text: 'Ver Participantes',
            onPress: () => router.replace(`/event/${id}/people`),
          },
        ]
      );
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Alert.alert(
        'Erro no Check-in',
        err.response?.data?.message || 'QR Code inválido ou você não está confirmado neste evento',
        [
          {
            text: 'Tentar novamente',
            onPress: () => {
              setScanned(false);
              setProcessing(false);
            },
          },
          {
            text: 'Voltar',
            onPress: () => router.back(),
            style: 'cancel',
          },
        ]
      );
    }
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center px-6">
        <Text className="text-white text-xl font-bold text-center mb-4">
          Permissão de Câmera
        </Text>
        <Text className="text-gray-400 text-center mb-6">
          Precisamos de acesso à câmera para escanear o QR Code do evento.
        </Text>
        <Pressable
          className="bg-violet-600 px-8 py-4 rounded-2xl"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold text-lg">
            Permitir Câmera
          </Text>
        </Pressable>
        <Pressable className="mt-4 py-3" onPress={() => router.back()}>
          <Text className="text-gray-400">Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Check-in QR Code',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerBackTitle: 'Voltar',
        }}
      />
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />

        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top */}
          <View style={styles.overlaySection} />

          {/* Middle row */}
          <View style={styles.middleRow}>
            <View style={styles.overlaySection} />

            {/* Scanner Frame */}
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>

            <View style={styles.overlaySection} />
          </View>

          {/* Bottom */}
          <View style={styles.overlaySection}>
            <View style={styles.instructions}>
              <Text style={styles.instructionsText}>
                {processing ? 'Processando...' : 'Aponte para o QR Code do evento'}
              </Text>
              <Text style={styles.instructionsSubtext}>
                O organizador deve mostrar o QR Code para você escanear
              </Text>
            </View>
          </View>
        </View>

        {/* GPS Alternative Button */}
        <SafeAreaView style={styles.bottomContainer} edges={['bottom']}>
          <Pressable
            style={styles.gpsButton}
            onPress={() => {
              router.back();
            }}
          >
            <Text style={styles.gpsButtonText}>
              Usar check-in por localização
            </Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  overlaySection: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 280,
  },
  scannerFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#7C3AED',
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  instructions: {
    alignItems: 'center',
    paddingTop: 32,
  },
  instructionsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionsSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  gpsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gpsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
