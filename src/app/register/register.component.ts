import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AddUser } from '../entities/addUser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { AlertService } from '../service/alert.service';
import { AuthentificationService } from '../service/authentification.service';
import { first } from 'rxjs';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  loading = false;
  u: AddUser = new AddUser();
  constructor(
    public fb: FormBuilder,
    private location: Location,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private authentification: AuthentificationService
  ) {
    if (this.authentification.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }
  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: MustMatch('password', 'confirmPassword') }
    );
  }
  get f() {
    return this.registerForm.controls;
  }
  goBack(): void {
    this.location.back();
  }
  /*
   * Register new user
   */
  register() {
    this.submitted = true;
    //reset alerts
    this.alertService.clear();
    /** Stop if the form is invalid */
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.u.firstName = this.f['firstName'].value;
    this.u.lastName = this.f['lastName'].value;
    this.u.email = this.f['email'].value;
    this.u.password = this.f['password'].value;
    this.userService
      .register(this.u)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.loading = false;
          this.alertService.error('Cet email est deja utilisé', false);
        }
      );
    //this.resetFields();
  }

  /**
   * Reset all inputs fields
   */
  resetFields() {
    this.registerForm!.reset();
    this.submitted = false;
  }
}
