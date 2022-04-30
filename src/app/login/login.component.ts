import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginUser } from '../entities/login-user';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationService } from '../service/authentification.service';
import { AlertService } from '../service/alert.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  returnUrl!: String;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private authentification: AuthentificationService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    if (this.authentification.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false, Validators.required],
    });
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }
  goBack(): void {
    this.location.back();
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;

    this.alertService.clear();

    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    let user: LoginUser = new LoginUser();
    user.email = this.f['email'].value;
    user.password = this.f['password'].value;
    this.authentification
      .login(user, this.f['rememberMe'].value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.loading = false;
          this.alertService.error("Cet utilisateur n'existe pas!");
        }
      );
    this.resetForm();
    //this.router.navigate(['/dashboard']).then();
  }

  resetForm() {
    this.loginForm.reset();
    this.submitted = false;
  }
}
