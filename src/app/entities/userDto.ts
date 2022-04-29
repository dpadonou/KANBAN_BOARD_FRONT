import { Board } from './board';
import { Card } from './card';

export class UserDto {
  id: number = 0;
  firstName: String = '';
  lastName: String = '';
  email: String = '';
  password: String = '';
  tachesAssigner: Card[] = [];
  tachesCreer: Card[] = [];
  boardCreer: Board[] = [];
}
