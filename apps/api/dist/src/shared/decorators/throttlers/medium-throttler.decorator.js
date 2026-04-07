"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediumThrottler = void 0;
const throttler_1 = require("@nestjs/throttler");
const MediumThrottler = () => (0, throttler_1.Throttle)({
    medium: {
        ttl: (0, throttler_1.seconds)(10),
        limit: 20,
    },
});
exports.MediumThrottler = MediumThrottler;
//# sourceMappingURL=medium-throttler.decorator.js.map