/* eslint-disable prettier/prettier */
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    senha: z.string().min(6),
  });

  const { email, senha } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      senha,
    });
    const token = await reply.jwtSign(
      {
        perfil_id: user.perfil_id,
      },
      {
        sign: {
          sub: user.id_usuario.toString(),
        },
      }
    );
    return reply.status(200).send({
      token,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
//     const refreshToken = await reply.jwtSign(
//       {
//         // role: user.role
//         perfil_id: user.perfil_id,
//       },
//       {
//         sign: {
//           sub: user.id_usuario.toString(),
//           expiresIn: "7d",
//         },
//       }
//     );
//     return reply
//       .setCookie("refreshToken", refreshToken, {
//         path: "/",
//         secure: true,
//         sameSite: true,
//         httpOnly: true, // Não vai ficar salvo no front
//       })
//       .status(200)
//       .send({
//         token,
//       });
//   } catch (err) {
//     if (err instanceof InvalidCredentialsError) {
//       return reply.status(400).send({ message: err.message });
//     }

//     throw err;
//   }
// }
