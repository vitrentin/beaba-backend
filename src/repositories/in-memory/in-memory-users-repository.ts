import { Prisma, Usuario } from "@prisma/client";
import { UsersRepository } from "../users-repository";
export class InMemoryUsersRepository implements UsersRepository {
  public items: Usuario[] = [];
  private lastUserId = 0;
  async searchMany(query: string, page: number) {
    return this.items
      .filter((items) => items.nome_usuario.includes(query))
      .slice((page - 1) * 10, page * 10);
  }

  async countByUserId(userId: number) {
    return this.items.filter((user) => user.id_usuario === userId).length;
  }

  async findManyByUserId(userId: number, page: number) {
    return this.items
      .filter((user) => user.id_usuario === userId)
      .slice((page - 1) * 10, page * 10);
  }

  async findById(id: number) {
    const user = this.items.find((item) => item.id_usuario === id);
    if (!user) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);
    if (!user) {
      return null;
    }
    return user;
  }

  async create(data: Prisma.UsuarioCreateInput) {
    this.lastUserId++;
    const user = {
      id_usuario: this.lastUserId,
      nome_usuario: data.nome_usuario,
      email: data.email,
      senha_hash: data.senha_hash,
      created_at: new Date(),
      updated_at: null,
      perfil_id: null,
    };

    this.items.push(user);

    return user;
  }
}
