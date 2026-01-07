import { Module, forwardRef } from '@nestjs/common';

import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => NotificationsModule),
    forwardRef(() => ChatModule),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
