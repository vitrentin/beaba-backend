/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProfilesRepository } from "./../profiles-repository";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class PrismaProfilesRepository implements ProfilesRepository {
  async findByName(name: string) {
    const profile = await prisma.perfil.findUnique({
      where: {
        nome_perfil: name,
      },
    });
    return profile;
  }

  async searchMany(query: string, page: number) {
    const profile = await prisma.perfil.findMany({
      where: {
        nome_perfil: {
          contains: query,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return profile;
  }

  async create(data: Prisma.PerfilCreateInput) {
    const profile = await prisma.perfil.create({
      data,
    });
    return profile;
  }
}
