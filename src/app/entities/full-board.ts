import { SectionDto } from './sectionDto';
import { User } from './user';

export class FullBoard {
  id: number = 0;
  title: String = '';
  author!: User;
  sections: SectionDto[] = [];
}
