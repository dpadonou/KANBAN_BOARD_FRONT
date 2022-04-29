import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { AppComponent } from '../app.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AddBoard } from '../entities/add-board';
import { Section } from '../entities/section';
import { SectionService } from '../service/section.service';
import { AlertService } from '../service/alert.service';
import { AuthentificationService } from '../service/authentification.service';
import { BoardServiceService } from '../service/board-service.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  closeResult!: string;
  submitted = false;
  loading = false;
  boardForm!: FormGroup;
  sections: number[] = [];
  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private fb: FormBuilder,
    private auth: AuthentificationService,
    private dash: AppComponent,
    private boardService: BoardServiceService,
    private sectionService: SectionService
  ) {}

  ngOnInit(): void {
    this.sectionService
      .getAllSections()
      .pipe(first())
      .subscribe((data) => {
        data.forEach((e: any) => {
          this.sections.push(e.id);
          //sections.push(s);
        });
      });
    this.boardForm = this.fb.group({
      title: ['', Validators.required],
      defaultSection: [false],
    });
  }
  public get f() {
    return this.boardForm.controls;
  }
  create() {
    this.submitted = true;
    this.alertService.clear();
    if (this.boardForm.invalid) {
      return;
    }
    this.loading = true;
    let b = new AddBoard();
    b.title = this.f['title'].value;
    b.author = this.auth.currentUserValue.id;
    if (this.f['defaultSection'].value) {
      console.log('okay');
      b.sections = this.sections;
      this.boardService
        .create(b)
        .pipe(first())
        .subscribe(
          (data) => {
            this.alertService.success('New Board created', false);
            this.loading = false;
            this.modalService.dismissAll();
            this.dash.adduserBoard(data);
            this.boardForm.reset();
          },
          (error) => {
            this.alertService.error("Echec de l'operation", false);
            this.loading = false;
            this.modalService.dismissAll();
          }
        );
    } else {
      b.sections = [];
      this.boardService
        .create(b)
        .pipe(first())
        .subscribe(
          (data) => {
            this.alertService.success('New Board created', false);
            this.loading = false;
            this.modalService.dismissAll();
            this.dash.adduserBoard(data);
            this.boardForm.reset();
            this.submitted = false;
          },
          (error) => {
            this.alertService.error("Echec de l'operation", false);
            this.loading = false;
            this.submitted = false;
            this.modalService.dismissAll();
          }
        );
    }
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
}
