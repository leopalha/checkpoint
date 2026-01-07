import { Module, forwardRef } from '@nestjs/common';

import { RematchController } from './rematch.controller';
import { RematchService } from './rematch.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => NotificationsModule),
    forwardRef(() => ChatModule),
  ],
  controllers: [RematchController],
  providers: [RematchService],
  exports: [RematchService],
})
export class RematchModule {}
