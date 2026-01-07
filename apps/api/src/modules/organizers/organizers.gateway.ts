import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

interface OrganizerSocket extends Socket {
  organizerId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.DASHBOARD_URL || 'http://localhost:3001',
    credentials: true,
  },
  namespace: '/organizers',
})
export class OrganizersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(OrganizersGateway.name);

  constructor(private prisma: PrismaService) {}

  async handleConnection(client: OrganizerSocket) {
    this.logger.log(`Organizer client connected: ${client.id}`);
  }

  handleDisconnect(client: OrganizerSocket) {
    this.logger.log(`Organizer client disconnected: ${client.id}`);
  }

  @SubscribeMessage('organizer:join-event')
  async handleJoinEvent(
    @ConnectedSocket() client: OrganizerSocket,
    @MessageBody() data: { eventId: string },
  ) {
    const roomName = `event:${data.eventId}`;
    await client.join(roomName);
    this.logger.log(`Client ${client.id} joined room ${roomName}`);

    // Send current stats
    const stats = await this.getEventStats(data.eventId);
    client.emit('event:stats', stats);

    return { success: true, room: roomName };
  }

  @SubscribeMessage('organizer:leave-event')
  async handleLeaveEvent(
    @ConnectedSocket() client: OrganizerSocket,
    @MessageBody() data: { eventId: string },
  ) {
    const roomName = `event:${data.eventId}`;
    await client.leave(roomName);
    this.logger.log(`Client ${client.id} left room ${roomName}`);

    return { success: true };
  }

  // Methods to emit updates to organizers
  async emitPresenceUpdate(
    eventId: string,
    data: {
      userId: string;
      userName: string;
      userPicture: string | null;
      action: 'confirmed' | 'checked_in' | 'checked_out';
    },
  ) {
    const roomName = `event:${eventId}`;
    this.server.to(roomName).emit('presence:update', {
      eventId,
      ...data,
      timestamp: new Date().toISOString(),
    });

    // Also send updated stats
    const stats = await this.getEventStats(eventId);
    this.server.to(roomName).emit('event:stats', stats);
  }

  async emitMatchCreated(
    eventId: string,
    data: {
      matchType: string;
      user1Name: string;
      user2Name: string;
    },
  ) {
    const roomName = `event:${eventId}`;
    this.server.to(roomName).emit('match:created', {
      eventId,
      ...data,
      timestamp: new Date().toISOString(),
    });

    // Also send updated stats
    const stats = await this.getEventStats(eventId);
    this.server.to(roomName).emit('event:stats', stats);
  }

  async emitInteractionUpdate(eventId: string) {
    const roomName = `event:${eventId}`;
    const stats = await this.getEventStats(eventId);
    this.server.to(roomName).emit('event:stats', stats);
  }

  private async getEventStats(eventId: string) {
    const [totalConfirmed, totalCheckedIn, totalMatches, totalInteractions] = await Promise.all([
      this.prisma.presence.count({
        where: { eventId },
      }),
      this.prisma.presence.count({
        where: { eventId, checkedInAt: { not: null } },
      }),
      this.prisma.match.count({
        where: { eventId },
      }),
      this.prisma.interaction.count({
        where: { eventId },
      }),
    ]);

    return {
      eventId,
      totalConfirmed,
      totalCheckedIn,
      totalMatches,
      totalInteractions,
    };
  }
}
