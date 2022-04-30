import { Component, ElementRef, Type, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { BoardDto } from './entities/boardDto';
import { CardDto } from './entities/cardDto';
import { User } from './entities/user';
import { UserDto } from './entities/userDto';
import { AuthentificationService } from './service/authentification.service';
import { BoardServiceService } from './service/board-service.service';
import { CardService } from './service/card.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currentUser!: UserDto;
  currentBoard!: BoardDto;
  public userBoard: BoardDto[] = [];
  userCards: CardDto[] = [];
  constructor(
    public modal: NgbModal,
    private authentificationService: AuthentificationService,
    public boardService: BoardServiceService,
    private cardService: CardService
  ) {
    this.authentificationService.currentUser.subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser) {
        // console.log('yep');
        this.clearUserBoard();
        boardService
          .getAllUserBoard(this.currentUser.id)
          .pipe(first())
          .subscribe((data) => {
            // console.log(data);
            data.forEach((e: BoardDto) => {
              this.userBoard.push(e);
            });
          });
        this.userCards = [];
        cardService
          .findByUserId(this.currentUser.id)
          .pipe(first())
          .subscribe((data) => {
            data.forEach((e: CardDto) => {
              this.userCards.push(e);
            });
          });
      }
    });
    this.authentificationService.currentBoard.subscribe((board) => {
      console.log(board);
      this.currentBoard = board;
    });
  }
  adduserBoard(b: BoardDto) {
    this.userBoard.push(b);
  }

  clearUserBoard() {
    this.userBoard = [];
  }

  ngOnInit(): void {
    this.clearUserBoard();
  }

  title = 'kanban';
  public isMenuCollapsed = false;
  public isCollapsed = false;

  selectBoard(board: BoardDto) {
    this.authentificationService.setCurrentBoardValue(board);
  }
  open(name: string) {
    console.log(MODALS[name]);
    this.modal.open(MODALS[name]);
  }
}

/**Modals for logout  */
@Component({
  selector: 'ngbd-modal-confirm',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">
        Confirmation de la deconnexion
      </h4>
      <button
        type="button"
        class="btn-close"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body">
      <p>
        <strong>Voulez vous vraiment vous deconnecter ?</strong>
      </p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-secondary"
        (click)="modal.dismiss('cancel click')"
      >
        Annuler
      </button>
      <button type="button" class="btn btn-danger" (click)="logOut()">
        Valider
      </button>
    </div>
  `,
})
export class NgbdModalConfirm {
  constructor(
    public modal: NgbActiveModal,
    private authentificationService: AuthentificationService,
    private router: Router //private app: AppComponent
  ) {}

  logOut() {
    this.authentificationService.logout();
    //this.app.clearUserBoard();
    this.router.navigate(['/login']);
    this.modal.close('Ok click');
  }
}
const MODALS: { [name: string]: Type<any> } = {
  focusFirst: NgbdModalConfirm,
};
