"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrip = updateTrip;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const dayjs_1 = require("../lib/dayjs");
const client_error_1 = require("../errors/client-error");
function updateTrip(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.withTypeProvider().put('/trips/:tripId', {
            schema: {
                params: zod_1.z.object({
                    tripId: zod_1.z.string().uuid(),
                }),
                body: zod_1.z.object({
                    destination: zod_1.z.string().min(4),
                    starts_at: zod_1.z.coerce.date(),
                    ends_at: zod_1.z.coerce.date(),
                }),
            },
        }, (request) => __awaiter(this, void 0, void 0, function* () {
            const { tripId } = request.params;
            const { destination, starts_at, ends_at } = request.body;
            const trip = yield prisma_1.prisma.trip.findUnique({
                where: { id: tripId }
            });
            if (!trip) {
                throw new client_error_1.ClientError('Trip not found');
            }
            if ((0, dayjs_1.dayjs)(starts_at).isBefore(new Date())) {
                throw new client_error_1.ClientError('Invalid trip start date.');
            }
            if ((0, dayjs_1.dayjs)(ends_at).isBefore(starts_at)) {
                throw new client_error_1.ClientError('Invalid trip end date.');
            }
            yield prisma_1.prisma.trip.update({
                where: { id: tripId },
                data: {
                    destination,
                    starts_at,
                    ends_at,
                },
            });
            return { tripId: trip.id };
        }));
    });
}
//# sourceMappingURL=update-trip.js.map