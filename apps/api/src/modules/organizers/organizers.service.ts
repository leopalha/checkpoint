import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';
import {
  RegisterOrganizerDto,
  LoginOrganizerDto,
  UpdateOrganizerDto,
  ChangePasswordDto,
  OrganizerResponseDto,
  AuthResponseDto,
} from './dto/organizer.dto';

@Injectable()
export class OrganizersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Register a new organizer
   */
  async register(dto: RegisterOrganizerDto): Promise<AuthResponseDto> {
    // Check if email already exists
    const existing = await this.prisma.organizer.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create organizer
    const organizer = await this.prisma.organizer.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name,
        companyName: dto.companyName || null,
      },
    });

    // Generate token
    const accessToken = this.generateToken(organizer.id);

    return {
      accessToken,
      organizer: this.formatOrganizer(organizer),
    };
  }

  /**
   * Login an organizer
   */
  async login(dto: LoginOrganizerDto): Promise<AuthResponseDto> {
    const organizer = await this.prisma.organizer.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!organizer) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isValidPassword = await bcrypt.compare(dto.password, organizer.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const accessToken = this.generateToken(organizer.id);

    return {
      accessToken,
      organizer: this.formatOrganizer(organizer),
    };
  }

  /**
   * Get organizer profile
   */
  async getProfile(organizerId: string): Promise<OrganizerResponseDto> {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id: organizerId },
    });

    if (!organizer) {
      throw new NotFoundException('Organizador não encontrado');
    }

    return this.formatOrganizer(organizer);
  }

  /**
   * Update organizer profile
   */
  async updateProfile(
    organizerId: string,
    dto: UpdateOrganizerDto,
  ): Promise<OrganizerResponseDto> {
    const organizer = await this.prisma.organizer.update({
      where: { id: organizerId },
      data: {
        name: dto.name,
        companyName: dto.companyName,
      },
    });

    return this.formatOrganizer(organizer);
  }

  /**
   * Change password
   */
  async changePassword(
    organizerId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id: organizerId },
    });

    if (!organizer) {
      throw new NotFoundException('Organizador não encontrado');
    }

    const isValidPassword = await bcrypt.compare(
      dto.currentPassword,
      organizer.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.organizer.update({
      where: { id: organizerId },
      data: { passwordHash: newPasswordHash },
    });
  }

  /**
   * Get organizer's events with stats
   */
  async getMyEvents(organizerId: string) {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: {
            presences: true,
            interactions: true,
            matches: true,
          },
        },
      },
    });

    return events.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      imageUrl: event.imageUrl,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      locationName: event.locationName,
      locationAddress: event.locationAddress,
      themeId: event.themeId,
      allowedInteractions: event.allowedInteractions,
      gpsRadius: event.gpsRadius,
      qrCode: event.qrCode,
      stats: {
        presences: event._count.presences,
        interactions: event._count.interactions,
        matches: event._count.matches,
      },
      createdAt: event.createdAt.toISOString(),
    }));
  }

  /**
   * Get event stats
   */
  async getEventStats(organizerId: string, eventId: string) {
    // Verify ownership
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        organizerId,
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    // Get counts
    const [
      confirmedCount,
      checkedInCount,
      interactionsCount,
      matchesCount,
      revealedMatchesCount,
    ] = await Promise.all([
      this.prisma.presence.count({ where: { eventId } }),
      this.prisma.presence.count({ where: { eventId, checkedInAt: { not: null } } }),
      this.prisma.interaction.count({ where: { eventId } }),
      this.prisma.match.count({ where: { eventId } }),
      this.prisma.match.count({ where: { eventId, status: 'revealed' } }),
    ]);

    // Get interaction breakdown
    const interactionsByType = await this.prisma.interaction.groupBy({
      by: ['type'],
      where: { eventId },
      _count: { type: true },
    });

    // Get hourly check-ins for chart
    const checkIns = await this.prisma.presence.findMany({
      where: {
        eventId,
        checkedInAt: { not: null },
      },
      select: {
        checkedInAt: true,
      },
    });

    const hourlyCheckIns: Record<string, number> = {};
    checkIns.forEach((p) => {
      if (p.checkedInAt) {
        const hour = p.checkedInAt.toISOString().slice(0, 13);
        hourlyCheckIns[hour] = (hourlyCheckIns[hour] || 0) + 1;
      }
    });

    return {
      event: {
        id: event.id,
        name: event.name,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
      },
      counts: {
        confirmed: confirmedCount,
        checkedIn: checkedInCount,
        interactions: interactionsCount,
        matches: matchesCount,
        revealedMatches: revealedMatchesCount,
      },
      interactionsByType: interactionsByType.map((i) => ({
        type: i.type,
        count: i._count.type,
      })),
      hourlyCheckIns: Object.entries(hourlyCheckIns)
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => a.hour.localeCompare(b.hour)),
    };
  }

  private generateToken(organizerId: string): string {
    return this.jwtService.sign(
      { sub: organizerId, type: 'organizer' },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  private formatOrganizer(organizer: {
    id: string;
    email: string;
    name: string;
    companyName: string | null;
    createdAt: Date;
  }): OrganizerResponseDto {
    return {
      id: organizer.id,
      email: organizer.email,
      name: organizer.name,
      companyName: organizer.companyName,
      createdAt: organizer.createdAt.toISOString(),
    };
  }
}
