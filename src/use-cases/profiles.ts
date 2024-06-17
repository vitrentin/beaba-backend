/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProfileAlreadyExistsError } from "@/use-cases/errors/profile-already-exists-erros";
import { ProfilesRepository } from "./../repositories/profiles-repository";
import { Perfil } from "@prisma/client";

interface ProfilesUseCaseRequest {
  nome_perfil: string;
  // nome_modulo: string;
}

interface ProfilesUseCaseResponse {
  profile: Perfil;
}

export class ProfilesUseCase {
  constructor(
    private profilesRepository: ProfilesRepository
    // private modulesRepository: ModulesRepository
  ) {}

  async execute({
    nome_perfil,
    // nome_modulo
  }: ProfilesUseCaseRequest): Promise<ProfilesUseCaseResponse> {
    const profileWithSameName =
      await this.profilesRepository.findByName(nome_perfil);
    if (profileWithSameName) {
      throw new ProfileAlreadyExistsError();
    }
    const profile = await this.profilesRepository.create({
      nome_perfil,
    });
    // const module = awat this.modulesRepository.findByName(nome_modulo)
    /*
        if(!module){
            throw new ResourceNotFoundError()
        }
        // vincular o perfil com o módulo
        // colocar as dependencias de modulo no teste
    */

    return { profile };
  }
}
