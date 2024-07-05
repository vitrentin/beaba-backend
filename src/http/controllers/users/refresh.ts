// /* eslint-disable prettier/prettier */
// import { FastifyReply, FastifyRequest } from "fastify";

// export async function refresh(request: FastifyRequest, reply: FastifyReply) {
//   await request.jwtVerify({ onlyCookie: true });

//   const { perfil_id } = request.user;

//   const token = await reply.jwtSign(
//     { perfil_id },
//     {
//       sign: {
//         sub: request.user.sub,
//       },
//     }
//   );
//   const refreshToken = await reply.jwtSign(
//     { perfil_id },
//     {
//       sign: {
//         sub: request.user.sub,
//         expiresIn: "7d",
//       },
//     }
//   );
//   return reply
//     .setCookie("refreshToken", refreshToken, {
//       path: "/",
//       secure: true,
//       sameSite: true,
//       httpOnly: true, // Não vai ficar salvo no front
//     })
//     .status(200)
//     .send({
//       token,
//     });
// }
