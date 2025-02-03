import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/common.interface';

// Define a key for the roles metadata
export const ROLES_KEY = 'roles';

// Define the @Roles decorator
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
