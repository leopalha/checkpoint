// Validation Utilities

import { InteractionType } from '@checkpoint/types';

const VALID_INTERACTION_TYPES: InteractionType[] = [
  'fire',
  'handshake',
  'highfive',
  'carona',
  'ticket',
  'champagne',
  'briefcase',
  'target',
];

export function isValidInteractionType(type: string): type is InteractionType {
  return VALID_INTERACTION_TYPES.includes(type as InteractionType);
}

export function validateInteractionTypes(types: string[]): InteractionType[] {
  return types.filter(isValidInteractionType) as InteractionType[];
}

export function validateBio(bio: string): { valid: boolean; error?: string } {
  if (bio.length > 150) {
    return { valid: false, error: 'Bio deve ter no máximo 150 caracteres' };
  }
  return { valid: true };
}

export function validateStatus(status: string): { valid: boolean; error?: string } {
  if (status.length > 100) {
    return { valid: false, error: 'Status deve ter no máximo 100 caracteres' };
  }
  return { valid: true };
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}
