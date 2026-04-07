"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortThrottler = void 0;
const throttler_1 = require("@nestjs/throttler");
const ShortThrottler = () => (0, throttler_1.Throttle)({
    short: {
        ttl: (0, throttler_1.seconds)(1),
        limit: 3,
    },
});
exports.ShortThrottler = ShortThrottler;
//# sourceMappingURL=short-throttler.decorator.js.map