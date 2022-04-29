import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AddUser } from '../entities/addUser';
import { UserDto } from '../entities/userDto';
import { AlertService } from '../service/alert.service';
import { AuthentificationService } from '../service/authentification.service';
import { UserService } from '../service/user.service';
import { MustMatch } from '../_helpers/must-match.validator';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
  loading = false;
  submitted = false;
  submitted2 = false;
  loading2 = false;
  updateDetailsForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser!: UserDto;
  constructor(
    private fb: FormBuilder,
    private authentification: AuthentificationService,
    private alertService: AlertService,
    private userService: UserService,
    private router: Router
  ) {
    this.currentUser = authentification.currentUserValue;
    if (!this.authentification.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.updateDetailsForm = this.fb.group({
      firstName: [this.currentUser.firstName, [Validators.required]],
      lastName: [this.currentUser.lastName, Validators.required],
    });
    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: MustMatch('password', 'confirmPassword') }
    );
  }
  get f1() {
    return this.updateDetailsForm.controls;
  }
  get f2() {
    return this.passwordForm.controls;
  }
  /**Update first name and last name */
  updateNameOrLastName() {
    this.submitted = true;
    this.alertService.clear;
    if (this.updateDetailsForm.invalid) {
      return;
    }
    this.loading = true;
    let user = new AddUser();
    user.email = this.currentUser.email;
    user.lastName = this.f1['firstName'].value;
    user.firstName = this.f1['lastName'].value;
    user.password = this.currentUser.password;
    this.userService
      .updateUser(user, this.currentUser.id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Modification effectuée', false);
          this.loading = false;
          this.currentUser.firstName = this.f1['firstName'].value;
          this.authentification.currentUserValue.firstName =
            this.f1['firstName'].value;
          this.authentification.currentUserValue.lastName =
            this.f1['lastName'].value;
          this.currentUser.lastName = this.f1['lastName'].value;
        },
        (error) => {
          this.loading = false;
          this.alertService.error("Echec de l'operation", false);
        }
      );
  }
  /**Update password */
  updatePassword() {
    this.submitted2 = true;
    this.alertService.clear;
    if (this.passwordForm.invalid) {
      return;
    }
    this.loading2 = true;
    let user = new AddUser();
    user.email = this.currentUser.email;
    user.lastName = this.currentUser.lastName;
    user.firstName = this.currentUser.firstName;
    user.password = this.f2['password'].value;
    this.userService
      .updateUser(user, this.currentUser.id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Mot de passe changé', false);
          this.loading2 = false;
          this.currentUser.password = this.f2['password'].value;
          this.authentification.currentUserValue.password =
            this.f2['password'].value;
        },
        (error) => {
          this.loading2 = false;
          this.alertService.error(
            'Erreur de la modification du mot de passe',
            false
          );
        }
      );
  }

  /*deleteUser() {
    this.alertService.clear();
    this.userService
      .deleteUser(this.currentUser.id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Supression réussie');
          this.authentification.logout();
        },
        (error) => {
          this.alertService.error('Echec de la suppression');
        }
      );
  }*/
}
