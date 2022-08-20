export enum petTypeEnum {
  dog = 1,
  cat = 2,
}

export type PetType = petTypeEnum.dog | petTypeEnum.cat;
