import { Component, ElementRef, Type, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from './entities/user';
import { UserDto } from './entities/userDto';
import { AuthentificationService } from './service/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currentUser!: UserDto;
  constructor(
    public modal: NgbModal,
    private authentificationService: AuthentificationService
  ) {
    this.authentificationService.currentUser.subscribe(
      (user) => (this.currentUser = user)
    );
  }
  ngOnInit(): void {}
  title = 'kanban';
  public isMenuCollapsed = false;
  public isCollapsed = false;
  open(name: string) {
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
    private router: Router
  ) {}
  logOut() {
    this.authentificationService.logout();
    this.router.navigate(['/login']);
    this.modal.close('Ok click');
  }
}
const MODALS: { [name: string]: Type<any> } = {
  focusFirst: NgbdModalConfirm,
};
