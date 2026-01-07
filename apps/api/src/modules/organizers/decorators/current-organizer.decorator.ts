import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentOrganizer = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const organizerId = request.organizerId;

    return data === 'organizerId' ? organizerId : { organizerId };
  },
);
