/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProfilesRepository } from "./../repositories/profiles-repository";
import { Perfil } from "@prisma/client";

interface SearchProfilesUseCaseRequest {
  query: string;
  page: number;
}

interface SearchProfilesUseCaseResponse {
  profile: Perfil[];
}

export class SearchProfilesUseCase {
  constructor(private profilesRepository: ProfilesRepository) {}

  async execute({
    query,
    page,
  }: SearchProfilesUseCaseRequest): Promise<SearchProfilesUseCaseResponse> {
    const profile = await this.profilesRepository.searchMany(query, page);
    return { profile };
  }
}
