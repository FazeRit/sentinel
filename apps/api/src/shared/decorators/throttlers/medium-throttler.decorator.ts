import { Throttle, seconds } from '@nestjs/throttler';

export const MediumThrottler = () =>
  Throttle({
    medium: {
      ttl: seconds(10),
      limit: 20,
    },
  });
