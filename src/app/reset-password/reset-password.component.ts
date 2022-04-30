import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { AlertService } from '../service/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';
import { AddUser } from '../entities/addUser';
import { first } from 'rxjs';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  submitted = false;
  loading = false;
  constructor(
    public fb: FormBuilder,
    private location: Location,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService
  ) {
    if (!this.userService.userForgotValue) {
      this.router.navigate(['/login']);
    }
  }
  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: MustMatch('password', 'confirmPassword') }
    );
  }
  get f() {
    return this.resetForm.controls;
  }
  goBack(): void {
    this.location.back();
  }
  resetPassword() {
    this.submitted = true;
    //reset alerts
    this.alertService.clear();

    if (this.resetForm.invalid) {
      return;
    }
    this.loading = true;
    let user = new AddUser();
    let id = this.userService.userForgotValue.id;
    user.email = this.userService.userForgotValue.email;
    user.lastName = this.userService.userForgotValue.lastName;
    user.firstName = this.userService.userForgotValue.firstName;
    user.password = this.f['password'].value;
    this.userService
      .updateUser(user, id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Modification effectuée avec succès', true);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.loading = false;
          this.alertService.error('Echec de la modification');
        }
      );
  }
}
