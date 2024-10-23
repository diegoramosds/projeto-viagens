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
exports.getParticipants = getParticipants;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
function getParticipants(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.withTypeProvider().get('/trips/:tripId/participants', {
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
                    participants: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            is_confirmed: true,
                        }
                    },
                },
            });
            if (!trip) {
                throw new client_error_1.ClientError('Trip not found');
            }
            return { participants: trip.participants };
        }));
    });
}
//# sourceMappingURL=get-participants.js.map