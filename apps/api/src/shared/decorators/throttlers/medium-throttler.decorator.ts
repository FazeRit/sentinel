import { Throttle, minutes } from '@nestjs/throttler';

export const MediumThrottler = () =>
  Throttle({
    medium: {
      ttl: minutes(10),
      limit: 20,
    },
  });
