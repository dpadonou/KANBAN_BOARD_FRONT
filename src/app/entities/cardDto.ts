import { Section } from './section';
import { User } from './user';

export class CardDto {
  id: number = 0;
  libelle: String = '';
  createdDate: String = '';
  deadLine: String = '';
  allocatedTime: number = 0;
  lieu: String = '';
  url: String = '';
  note: String = '';
  personnesEnCharge: User[] = [];
  section!: Section;
  creator!: User;
}
