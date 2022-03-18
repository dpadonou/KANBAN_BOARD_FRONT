import { Board } from './board';
import { Card } from './card';

export class SectionDto {
  id: number = 0;
  name: String = '';
  mboards: Board[] = [];
  mCards: Card[] = [];
}
