/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryProfilesRepository } from "@/repositories/in-memory/in-memory-profiles-repository";
import { ProfilesUseCase } from "./profiles";

// Unit Test
let profilesRepository: InMemoryProfilesRepository;
let sut: ProfilesUseCase;
describe("Profile Use Case", () => {
  beforeEach(() => {
    profilesRepository = new InMemoryProfilesRepository();
    sut = new ProfilesUseCase(profilesRepository);
  });
  it("should be able to register profile", async () => {
    const { profile } = await sut.execute({
      nome_perfil: "CAIXA VC",
    });

    expect(profile.id_perfil).toEqual(expect.any(Number));
  });
});
