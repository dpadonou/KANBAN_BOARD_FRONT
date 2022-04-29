export class AddFullCardDto {
  libelle!: String;
  createdDate!: String;
  deadLine!: String;
  allocatedTime!: number;
  lieu: String = '';
  url: String = '';
  note: String = '';
  author!: number;
  section!: number;
  board!: number;
}
