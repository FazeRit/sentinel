"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongThrottler = void 0;
const throttler_1 = require("@nestjs/throttler");
const LongThrottler = () => (0, throttler_1.Throttle)({
    short: {
        ttl: (0, throttler_1.minutes)(1),
        limit: 3,
    },
});
exports.LongThrottler = LongThrottler;
//# sourceMappingURL=long-throttler.decorator.js.map