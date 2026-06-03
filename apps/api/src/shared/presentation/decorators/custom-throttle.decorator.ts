import { SetMetadata } from '@nestjs/common';

export const THROTTLE_METADATA_KEY = Symbol('throtlle-metadata-key');

export interface IThrottleOptions {
  limit: number;
  ttl: number;
}

export const CustomThrottle = (options: IThrottleOptions) =>
  SetMetadata(THROTTLE_METADATA_KEY, options);
