import { Section } from './section';
import { User } from './user';

export class BoardDto {
  id: number = 0;
  title: String = '';
  author!: User;
  sections: Section[] = [];
}
