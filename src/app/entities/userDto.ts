import { Card } from './card';

export class UserDto {
  id: number = 0;
  firstName: String = '';
  lastname: String = '';
  email: String = '';
  password: String = '';
  assignedTasks: Card[] = [];
  createdTask: Card[] = [];
}
