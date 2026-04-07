import { Throttle, seconds } from '@nestjs/throttler';

export const ShortThrottler = () =>
  Throttle({
    short: {
      ttl: seconds(1),
      limit: 3,
    },
  });
