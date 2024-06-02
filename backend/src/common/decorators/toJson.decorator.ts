import { Transform } from 'class-transformer';

export function TransformJson(): PropertyDecorator {
  return Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value);
}
