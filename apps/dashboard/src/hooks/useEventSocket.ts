'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  connectSocket,
  disconnectSocket,
  joinEventRoom,
  leaveEventRoom,
  onPresenceUpdate,
  onMatchCreated,
  onEventStats,
  PresenceUpdate,
  MatchUpdate,
  EventStats,
} from '../lib/socket';

interface UseEventSocketOptions {
  eventId: string;
  onPresence?: (data: PresenceUpdate) => void;
  onMatch?: (data: MatchUpdate) => void;
  onStats?: (data: EventStats) => void;
}

export function useEventSocket({
  eventId,
  onPresence,
  onMatch,
  onStats,
}: UseEventSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [recentUpdates, setRecentUpdates] = useState<PresenceUpdate[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);

  useEffect(() => {
    connectSocket();
    setIsConnected(true);

    joinEventRoom(eventId);

    // Set up listeners
    const unsubPresence = onPresenceUpdate((data) => {
      if (data.eventId === eventId) {
        setRecentUpdates((prev) => [data, ...prev].slice(0, 10));
        onPresence?.(data);
      }
    });

    const unsubMatch = onMatchCreated((data) => {
      if (data.eventId === eventId) {
        onMatch?.(data);
      }
    });

    const unsubStats = onEventStats((data) => {
      if (data.eventId === eventId) {
        setStats(data);
        onStats?.(data);
      }
    });

    return () => {
      leaveEventRoom(eventId);
      unsubPresence();
      unsubMatch();
      unsubStats();
    };
  }, [eventId, onPresence, onMatch, onStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  const clearUpdates = useCallback(() => {
    setRecentUpdates([]);
  }, []);

  return {
    isConnected,
    recentUpdates,
    stats,
    clearUpdates,
  };
}

// Hook for dashboard-wide socket connection
export function useDashboardSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    connectSocket();
    setIsConnected(true);

    return () => {
      disconnectSocket();
      setIsConnected(false);
    };
  }, []);

  return { isConnected };
}
