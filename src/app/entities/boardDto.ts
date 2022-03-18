import { Section } from './section';

export class BoardDto {
  id: number = 0;
  title: String = '';
  sections: Section[] = [];
}
