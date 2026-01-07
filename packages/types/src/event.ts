// Event Types

import { ThemeId } from './theme';
import { InteractionType } from './user';

export interface Event {
  id: string;
  externalId?: string;
  source: 'manual' | 'sympla';
  name: string;
  description: string | null;
  imageUrl: string | null;
  startDate: Date;
  endDate: Date;
  location: EventLocation;
  organizerId: string;
  themeId: ThemeId;
  allowedInteractions: InteractionType[];
  gpsRadius: number; // meters, minimum 200
  qrCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventLocation {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface EventSummary {
  id: string;
  name: string;
  imageUrl: string | null;
  startDate: Date;
  location: EventLocation;
  confirmedCount: number;
  checkedInCount: number;
  friendsGoing: number;
  themeId: ThemeId;
}

export interface Presence {
  id: string;
  userId: string;
  eventId: string;
  intentions: InteractionType[];
  status: string | null;
  confirmedAt: Date;
  checkedInAt: Date | null;
  checkedOutAt: Date | null;
}

export interface ConfirmPresenceDto {
  intentions: InteractionType[];
  status?: string;
}

export interface CheckInDto {
  latitude: number;
  longitude: number;
  method: 'gps' | 'qr';
  qrCode?: string;
}
