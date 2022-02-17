import { Component, ElementRef, Type, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserSessionService } from './service/user-session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  user_id: number = 0;
  constructor(public modal: NgbModal, private user: UserSessionService) {}
  ngOnInit(): void {
    this.user.getUser().subscribe((id) => (this.user_id = id));
  }
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
      <button
        type="button"
        class="btn btn-danger"
        (click)="modal.close('Ok click')"
      >
        Valider
      </button>
    </div>
  `,
})
export class NgbdModalConfirm {
  constructor(public modal: NgbActiveModal) {}
}
const MODALS: { [name: string]: Type<any> } = {
  focusFirst: NgbdModalConfirm,
};
