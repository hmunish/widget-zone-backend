import {
  Gender,
  UserRole,
  UserStatus,
} from 'src/shared/enums/common.interface';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: Gender;
  emailId?: string;
  mobileNumber?: string;
  password: string;
  status: UserStatus;
  roles: UserRole[];
}
