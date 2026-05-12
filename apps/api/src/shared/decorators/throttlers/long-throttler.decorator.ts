import { Throttle, minutes } from '@nestjs/throttler';

export const LongThrottler = () =>
  Throttle({
    short: {
      ttl: minutes(1),
      limit: 5,
    },
  });
