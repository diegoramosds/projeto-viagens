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
exports.getActivities = getActivities;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const dayjs_1 = require("../lib/dayjs");
const client_error_1 = require("../errors/client-error");
function getActivities(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.withTypeProvider().get('/trips/:tripId/activities', {
            schema: {
                params: zod_1.z.object({
                    tripId: zod_1.z.string().uuid(),
                }),
            },
        }, (request) => __awaiter(this, void 0, void 0, function* () {
            const { tripId } = request.params;
            const trip = yield prisma_1.prisma.trip.findUnique({
                where: { id: tripId },
                include: {
                    activities: {
                        orderBy: {
                            occurs_at: 'asc',
                        }
                    }
                },
            });
            if (!trip) {
                throw new client_error_1.ClientError('Trip not found');
            }
            const differenceInDaysBetweenTripStartAndEnd = (0, dayjs_1.dayjs)(trip.ends_at).diff(trip.starts_at, 'days');
            const activities = Array.from({ length: differenceInDaysBetweenTripStartAndEnd + 1 }).map((_, index) => {
                const date = (0, dayjs_1.dayjs)(trip.starts_at).add(index, 'days');
                return {
                    date: date.toDate(),
                    activities: trip.activities.filter(activity => {
                        return (0, dayjs_1.dayjs)(activity.occurs_at).isSame(date, 'day');
                    })
                };
            });
            return { activities };
        }));
    });
}
//# sourceMappingURL=get-activities.js.map