import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { AddSection } from '../entities/add-section';
import { ManyToOne } from '../entities/many-to-one';
import { Section } from '../entities/section';
import { AlertService } from '../service/alert.service';
import { AuthentificationService } from '../service/authentification.service';
import { BoardServiceService } from '../service/board-service.service';
import { SectionService } from '../service/section.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent implements OnInit {
  sections: Section[] = [];
  selectSection: number[] = [];
  newSectionName!: String;
  loading = false;
  closeResult = '';
  constructor(
    private sectionService: SectionService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private route: Router,
    private auth: AuthentificationService,
    private boardService: BoardServiceService
  ) {
    this.sectionService
      .getAllSections()
      .pipe(first())
      .subscribe((data) => {
        //console.log(data);
        data.forEach((e: any) => {
          let s = new Section();
          s.id = e.id;
          s.name = e.name;
          this.sections.push(s);
        });
      });
  }
  addtoSelectSection(e: any) {
    if (e.target.checked) {
      this.selectSection.push(e.target.value);
    } else {
      if (this.selectSection.includes(e.target.value)) {
        this.selectSection.splice(
          this.selectSection.findIndex((elt: number) => elt == e.target.value),
          1
        );
      }
    }
    //console.log(this.selectSection);
  }
  ngOnInit(): void {}

  addSectionToCurrentBoard() {
    if (this.selectSection.length == 0 && !this.auth.currentBoardValue) {
      return;
    }
    this.loading = true;
    let m = new ManyToOne();
    m.mainId = this.auth.currentBoardValue.id;
    m.foreignIds = this.selectSection;
    console.log(m);
    this.boardService
      .addManySectionToBoard(m)
      .pipe(first())
      .subscribe(
        (data) => {
          this.auth.setCurrentBoardValue(data);
          this.loading = false;
          this.alertService.clear();
          this.alertService.success('Operation réussie');
        },
        (error) => {
          this.alertService.clear();
          this.alertService.error("Echec de l'operation");
          this.loading = false;
        }
      );
  }

  addSection() {
    if (!this.newSectionName) {
      return;
    }
    let a = new AddSection();
    a.name = this.newSectionName;
    this.sectionService
      .save(a)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.clear();
          this.alertService.success('Opération effectuée', true);
          this.newSectionName = '';
          this.route.navigate(['/dashboard']);
          this.modalService.dismissAll();
        },
        (error) => {
          this.alertService.clear();
          this.alertService.error('Opération échouée', false);
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
}
