import "@fastify/jwt";
declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string;
      // perfil_id: "Admin " | "Member";
      perfil_id: 1 | 2;
      // pode associar o perfil ao usuário pelo nome do perfil, em vez do id do perfil
      // já que o nome é único
    };
  }
}
