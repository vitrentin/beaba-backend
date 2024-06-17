/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findManyByUserId(userId: number, page: number) {
    const user = await prisma.usuario.findMany({
      where: {
        id_usuario: userId,
      },
      skip: (page - 1) * 10,
      take: 10,
    });

    return user;
  }

  async searchMany(query: string, page: number) {
    const user = await prisma.usuario.findMany({
      where: {
        nome_usuario: {
          contains: query,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return user;
  }

  async countByUserId(userId: number) {
    const count = await prisma.usuario.count({
      where: {
        id_usuario: userId,
      },
    });

    return count;
  }

  async findById(id: number) {
    const user = await prisma.usuario.findUnique({
      where: {
        id_usuario: id,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async create(data: Prisma.UsuarioCreateInput) {
    const user = await prisma.usuario.create({
      data,
    });
    return user;
  }
  // async save(data: Usuario) {
  //   const user = await prisma.usuario.update({
  //     where: {
  //   id_uduario: data.id_usuario,
  // },
  // data,
  //   });
  //   return user;
  // }
}
