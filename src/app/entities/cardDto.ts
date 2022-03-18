import { Section } from './section';
import { User } from './user';

export class CardDto {
  id: number = 0;
  isGitCard: boolean = false;
  libelle: String = '';
  createdDate: String = '';
  deadLine: String = '';
  allocatedTime: number = 0;
  lieu: String = '';
  url: String = '';
  note: String = '';
  urlIssue: String = '';
  gitHash: String = '';
  mUsers: User[] = [];
  mSection!: Section;
  creator!: User;
}
