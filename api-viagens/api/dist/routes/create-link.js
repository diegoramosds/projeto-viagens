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
exports.createLink = createLink;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../errors/client-error");
function createLink(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.withTypeProvider().post('/trips/:tripId/links', {
            schema: {
                params: zod_1.z.object({
                    tripId: zod_1.z.string().uuid(),
                }),
                body: zod_1.z.object({
                    title: zod_1.z.string().min(4),
                    url: zod_1.z.string().url(),
                }),
            },
        }, (request) => __awaiter(this, void 0, void 0, function* () {
            const { tripId } = request.params;
            const { title, url } = request.body;
            const trip = yield prisma_1.prisma.trip.findUnique({
                where: { id: tripId }
            });
            if (!trip) {
                throw new client_error_1.ClientError('Trip not found');
            }
            const link = yield prisma_1.prisma.link.create({
                data: {
                    title,
                    url,
                    trip_id: tripId,
                }
            });
            return { linkId: link.id };
        }));
    });
}
//# sourceMappingURL=create-link.js.map