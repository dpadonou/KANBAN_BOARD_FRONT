import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first, never } from 'rxjs';
import { AddCard } from '../entities/add-card';
import { AddFullCardDto } from '../entities/add-full-card-dto';
import { BoardDto } from '../entities/boardDto';
import { Card } from '../entities/card';
import { CardDto } from '../entities/cardDto';
import { FullBoard } from '../entities/full-board';
import { OneToOne } from '../entities/one-to-one';
import { SectionDto } from '../entities/sectionDto';
import { UserDto } from '../entities/userDto';
import { AlertService } from '../service/alert.service';
import { AuthentificationService } from '../service/authentification.service';
import { BoardServiceService } from '../service/board-service.service';
import { CardService } from '../service/card.service';
import { SectionService } from '../service/section.service';
import { UserService } from '../service/user.service';
import { Mapper } from '../_helpers/mapper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  closeResult = '';
  showSection = false;
  currentBoard2!: FullBoard;
  currentBoard!: BoardDto;
  cardForm!: FormGroup;
  loading = false;
  submitted = false;
  selectSection!: number;
  selectCard!: Card;
  userForCard!: number;
  newCardSection!: number;
  users: UserDto[] = [];

  constructor(
    private modalService: NgbModal,
    private auth: AuthentificationService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private cardService: CardService,
    private userService: UserService
  ) {
    this.auth.currentBoard.subscribe((board) => {
      //console.log(board);
      this.currentBoard = board;
      this.currentBoard2 = this.boardToBoardDTO(this.currentBoard);
      console.log(this.currentBoard2);
    });
    this.userService
      .getAllUsers()
      .pipe(first())
      .subscribe((data) => {
        data.forEach((d: UserDto) => {
          console.log(d);
          this.users.push(d);
        });
      });
  }

  ngOnInit(): void {
    this.cardForm = this.fb.group({
      libelle: ['', Validators.required],
      deadline: ['', Validators.required],
      lieu: [''],
      url: [''],
      note: [''],
    });
  }

  get f() {
    return this.cardForm.controls;
  }

  addCardToSection(content: any, sectionId: number) {
    this.selectSection = sectionId;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  updateCard(content: any, card: Card) {
    this.selectCard = card;
    this.cardForm.controls['libelle'].setValue(card.libelle);
    this.cardForm.controls['deadline'].setValue(
      formatDate(this.toDate(card.deadLine), 'yyyy-MM-dd', 'en')
    );
    this.cardForm.controls['lieu'].setValue(card.lieu);
    this.cardForm.controls['url'].setValue(card.url);
    this.cardForm.controls['note'].setValue(card.note);

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  createCard() {
    this.submitted = true;

    this.alertService.clear();
    if (this.cardForm.invalid && !this.selectSection) {
      return;
    }
    this.loading = true;

    let card = new AddFullCardDto();

    card.libelle = this.f['libelle'].value;
    card.lieu = this.f['lieu'].value;
    card.url = this.f['url'].value;
    card.note = this.f['note'].value;
    card.allocatedTime = 0;
    //console.log(this.f['deadline']);
    card.deadLine = this.formatDate(this.f['deadline'].value) + ' 00:00:00';
    card.createdDate = this.getDate();
    card.section = this.selectSection;
    card.author = this.auth.currentUserValue.id;
    card.board = this.auth.currentBoardValue.id;
    //console.log(card);
    this.cardService
      .createCard(card)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Operation effectuée');
          this.submitted = false;
          this.loading = false;
          this.modalService.dismissAll();
          this.cardForm.reset();
          this.currentBoard2 = this.boardToBoardDTO(this.currentBoard);
          this.selectSection = 0;
        },
        (error) => {
          this.loading = false;
          this.submitted = false;
          this.alertService.error("Echec de l'operation");
        }
      );
  }
  addUserToCard() {
    //console.log(this.userForCard);
    if (this.userForCard == 0 && !this.selectCard) {
      return;
    }
    this.alertService.clear();
    let obj = new OneToOne();
    obj.foreignId = this.userForCard;
    obj.mainId = this.selectCard.id;

    this.cardService
      .assignUserToCard(obj)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Operation réussie');
          this.selectCard!;
          this.userForCard = 0;
          this.modalService.dismissAll();
        },
        (error) => {
          this.alertService.error("Erreur de l'operation");
          this.selectCard!;
          this.userForCard = 0;
          this.modalService.dismissAll();
        }
      );
  }

  mergeCard() {
    console.log(this.selectCard);
    this.submitted = true;

    this.alertService.clear();
    if (this.cardForm.invalid && !this.selectCard) {
      return;
    }
    this.loading = true;
    let c = new AddCard();
    c.libelle = this.f['libelle'].value;
    c.deadLine = this.formatDate(this.f['deadline'].value) + ' 00:00:00';
    c.createdDate = this.selectCard.createdDate;
    c.allocatedTime = this.selectCard.allocatedTime;
    c.lieu = this.f['lieu'].value;
    c.url = this.f['url'].value;
    c.note = this.f['note'].value;
    console.log(c);
    this.cardService
      .updateCard(this.selectCard.id, c)
      .pipe(first())
      .subscribe(
        (data: Card) => {
          this.alertService.success('Modification effectuée');
          console.log(data);
          this.getCardSection(this.selectCard.id).cards.splice(
            this.getCardSection(this.selectCard.id).cards.findIndex(
              (elt: Card) => (elt.id = data.id)
            ),
            1,
            data
          );
          this.selectCard!;
          this.submitted = false;
          this.loading = false;
          this.cardForm.reset();
          this.modalService.dismissAll();
        },
        (error) => {
          this.alertService.error('operation echouée');
          this.selectCard!;
          this.submitted = false;
          this.loading = false;
          this.cardForm.reset();
          this.modalService.dismissAll();
        }
      );
  }

  moveCard() {
    if (!this.selectCard && this.newCardSection == 0) {
      return;
    }
    this.alertService.clear();
    let dto = new OneToOne();
    dto.mainId = this.selectCard.id;
    dto.foreignId = this.newCardSection;
    this.cardService
      .moveCard(dto)
      .pipe(first())
      .subscribe(
        (data: CardDto) => {
          this.alertService.success('Operation effectuée');
          this.getCardSection(this.selectCard.id).cards.splice(
            this.getCardSection(this.selectCard.id).cards.findIndex(
              (elt: Card) => (elt.id = data.id)
            ),
            1
          );
          this.getSectionFromCurrentBoard(data.section.id).cards.push(data);
          this.selectCard!;
          this.newCardSection = 0;
          this.modalService.dismissAll();
        },
        (error) => {
          this.alertService.error("Echec de l'operation");
          this.selectCard!;
          this.newCardSection = 0;
          this.modalService.dismissAll();
        }
      );
  }

  deleteTheCard() {
    // console.log('hey what');
    console.log(this.selectCard);
    if (!this.selectCard) {
      return;
    }
    this.alertService.clear();
    this.cardService
      .deleteCard(this.selectCard.id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Supression réussie');
          this.getCardSection(this.selectCard.id).cards.splice(
            this.getCardSection(this.selectCard.id).cards.findIndex(
              (elt: Card) => (elt.id = this.selectCard.id)
            ),
            1
          );
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
          this.alertService.error('Echec de la suppression');
          this.selectCard!;
          this.modalService.dismissAll();
        }
      );
  }

  formatDate(date: String): String {
    let splitted = date.split('-', 3);
    return splitted[2] + '/' + splitted[1] + '/' + splitted[0];
  }

  toDate(date: String): string {
    let splitted = date.split('/', 3);
    let sp = splitted[2].split(' ', 2);
    return sp[0] + '-' + splitted[1] + '-' + splitted[0];
  }

  getDate(): String {
    let d = new Date();
    let s = '';
    if (d.getMonth() < 10) {
      if (d.getMinutes() < 10) {
        s =
          d.getDate() +
          '/0' +
          d.getMonth() +
          '/' +
          d.getFullYear() +
          ' ' +
          d.getHours() +
          ':0' +
          d.getMinutes() +
          ':' +
          d.getSeconds();
      } else {
        s =
          d.getDate() +
          '/0' +
          d.getMonth() +
          '/' +
          d.getFullYear() +
          ' ' +
          d.getHours() +
          ':' +
          d.getMinutes() +
          ':' +
          d.getSeconds();
      }
    } else {
      if (d.getMinutes() < 10) {
        s =
          d.getDate() +
          '/' +
          d.getMonth() +
          '/' +
          d.getFullYear() +
          ' ' +
          d.getHours() +
          ':0' +
          d.getMinutes() +
          ':' +
          d.getSeconds();
      } else {
        s =
          d.getDate() +
          '/' +
          d.getMonth() +
          '/' +
          d.getFullYear() +
          ' ' +
          d.getHours() +
          ':' +
          d.getMinutes() +
          ':' +
          d.getSeconds();
      }
    }
    return s;
  }

  getSectionFromCurrentBoard(id: number): SectionDto {
    let section: SectionDto = new SectionDto();
    for (let s of this.currentBoard2.sections) {
      if ((s.id = id)) {
        section = s;
      }
    }
    return section;
  }

  boardToBoardDTO(b: BoardDto): FullBoard {
    let board = new FullBoard();
    board.id = b.id;
    board.author = b.author;
    board.title = b.title;
    for (let s of b.sections) {
      let section = new SectionDto();
      section.id = s.id;
      section.name = s.name;
      this.cardService
        .findCardByBoardAndSection(s.id, b.id)
        .pipe(first())
        .subscribe(
          (data) => {
            console.log(data);
            data.forEach((e: Card) => {
              section.cards.push(e);
            });
          },
          (error) => {
            section.cards = [];
          }
        );
      board.sections.push(section);
    }
    return board;
  }

  getCardSection(id: number): SectionDto {
    let section = new SectionDto();
    for (let s of this.currentBoard2.sections) {
      for (let c of s.cards) {
        if ((c.id = id)) {
          section = s;
        }
      }
    }
    return section;
  }
}
