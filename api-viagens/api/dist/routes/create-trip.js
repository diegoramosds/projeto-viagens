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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrip = createTrip;
const nodemailer_1 = __importDefault(require("nodemailer"));
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const mail_1 = require("../lib/mail");
const dayjs_1 = require("../lib/dayjs");
const client_error_1 = require("../errors/client-error");
const env_1 = require("../env");
function createTrip(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.withTypeProvider().post('/trips', {
            schema: {
                body: zod_1.z.object({
                    destination: zod_1.z.string().min(4),
                    starts_at: zod_1.z.coerce.date(),
                    ends_at: zod_1.z.coerce.date(),
                    owner_name: zod_1.z.string(),
                    owner_email: zod_1.z.string().email(),
                    emails_to_invite: zod_1.z.array(zod_1.z.string().email()),
                }),
            },
        }, (request) => __awaiter(this, void 0, void 0, function* () {
            const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite, } = request.body;
            if ((0, dayjs_1.dayjs)(starts_at).isBefore(new Date())) {
                throw new client_error_1.ClientError('Invalid trip start date.');
            }
            if ((0, dayjs_1.dayjs)(ends_at).isBefore(starts_at)) {
                throw new client_error_1.ClientError('Invalid trip end date.');
            }
            const trip = yield prisma_1.prisma.trip.create({
                data: {
                    destination,
                    starts_at,
                    ends_at,
                    participants: {
                        createMany: {
                            data: [
                                {
                                    name: owner_name,
                                    email: owner_email,
                                    is_owner: true,
                                    is_confirmed: true,
                                },
                                ...emails_to_invite.map((email) => {
                                    return { email };
                                }),
                            ],
                        },
                    },
                },
            });
            const formattedStartDate = (0, dayjs_1.dayjs)(starts_at).format('LL');
            const formattedEndDate = (0, dayjs_1.dayjs)(ends_at).format('LL');
            const confirmationLink = `${env_1.env.API_BASE_URL}/trips/${trip.id}/confirm`;
            const mail = yield (0, mail_1.getMailClient)();
            const message = yield mail.sendMail({
                from: {
                    name: 'Equipe plann.er',
                    address: 'oi@plann.er',
                },
                to: {
                    name: owner_name,
                    address: owner_email,
                },
                subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
                html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua viagem, clique no link abaixo:</p>
          <p></p>
          <p>
            <a href="${confirmationLink}">Confirmar viagem</a>
          </p>
          <p></p>
          <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>
      `.trim(),
            });
            console.log(nodemailer_1.default.getTestMessageUrl(message));
            return { tripId: trip.id };
        }));
    });
}
//# sourceMappingURL=create-trip.js.map