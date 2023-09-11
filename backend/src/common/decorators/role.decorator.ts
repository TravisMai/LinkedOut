import { SetMetadata } from '@nestjs/common';

export const AllowRoles = (roles: string[]) => SetMetadata('roles', roles);