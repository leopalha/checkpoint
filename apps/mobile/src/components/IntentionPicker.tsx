import { View, Text, Pressable } from 'react-native';

interface IntentionPickerProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  allowedIntentions?: string[];
  maxSelections?: number;
}

const ALL_INTENTIONS = [
  { id: 'fire', emoji: '🔥', label: 'Interesse' },
  { id: 'handshake', emoji: '🤝', label: 'Networking' },
  { id: 'highfive', emoji: '✋', label: 'Amizade' },
  { id: 'carona', emoji: '🚗', label: 'Carona' },
  { id: 'ticket', emoji: '🎫', label: 'Ingresso' },
  { id: 'champagne', emoji: '🍾', label: 'Drinks' },
  { id: 'briefcase', emoji: '💼', label: 'Proposta' },
  { id: 'target', emoji: '🎯', label: 'Objetivo' },
];

export function IntentionPicker({
  selected,
  onChange,
  allowedIntentions,
  maxSelections = 4,
}: IntentionPickerProps) {
  const availableIntentions = allowedIntentions
    ? ALL_INTENTIONS.filter((i) => allowedIntentions.includes(i.id))
    : ALL_INTENTIONS;

  const toggleIntention = (intentionId: string) => {
    if (selected.includes(intentionId)) {
      onChange(selected.filter((id) => id !== intentionId));
    } else if (selected.length < maxSelections) {
      onChange([...selected, intentionId]);
    }
  };

  return (
    <View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600 text-sm">Selecione suas intenções</Text>
        <Text className="text-gray-400 text-sm">
          {selected.length}/{maxSelections}
        </Text>
      </View>

      <View className="flex-row flex-wrap -mx-1">
        {availableIntentions.map((intention) => {
          const isSelected = selected.includes(intention.id);
          const isDisabled = !isSelected && selected.length >= maxSelections;

          return (
            <Pressable
              key={intention.id}
              onPress={() => toggleIntention(intention.id)}
              disabled={isDisabled}
              className={`m-1 px-4 py-3 rounded-xl flex-row items-center ${
                isSelected
                  ? 'bg-violet-600'
                  : isDisabled
                  ? 'bg-gray-100 opacity-50'
                  : 'bg-gray-100'
              }`}
            >
              <Text className="text-xl mr-2">{intention.emoji}</Text>
              <Text
                className={`font-medium ${
                  isSelected ? 'text-white' : 'text-gray-700'
                }`}
              >
                {intention.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default IntentionPicker;
