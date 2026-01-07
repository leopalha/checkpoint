import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

type TabIconProps = {
  emoji: string;
  focused: boolean;
};

function TabIcon({ emoji, focused }: TabIconProps) {
  return (
    <View
      className={`items-center justify-center rounded-full w-12 h-12 ${
        focused ? 'bg-violet-100' : ''
      }`}
    >
      <Text className="text-2xl">{emoji}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 80,
          paddingTop: 10,
          paddingBottom: 20,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📅" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💜" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rematch"
        options={{
          title: 'ReMatch',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔄" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
