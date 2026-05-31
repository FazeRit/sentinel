export const IDEMPOTENCY_KEY_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
} as const;

export type TIdempotencyKeyStatus =
  (typeof IDEMPOTENCY_KEY_STATUS)[keyof typeof IDEMPOTENCY_KEY_STATUS];
