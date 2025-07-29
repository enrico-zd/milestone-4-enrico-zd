import { plainToInstance } from 'class-transformer';

export function mapEntityToDto<Dto, Entity>(
  dtoClass: new (...args: any[]) => Dto,
  entity: Entity,
): Dto {
  return plainToInstance(dtoClass, entity, { excludeExtraneousValues: true });
}
