
import { User } from './types';

export const VALID_USERS: User[] = [
  { username: 'admin', role: 'admin', displayName: 'Quản trị viên' }
];

export const GUEST_USER: User = {
  username: 'khach',
  role: 'user',
  displayName: 'Thành viên phòng họp'
};

export const APP_THEME = {
  primary: 'blue-600',
  secondary: 'gray-100',
  accent: 'indigo-500'
};
