import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { ForgotPasswordDto } from '../entities/forgot-passwordDto';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  submitted = false;
  loading = false;
  constructor(
    private location: Location,
    public fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotForm.controls;
  }
  goBack(): void {
    this.location.back();
  }
  forgotPassword() {
    this.submitted = true;

    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    let f: ForgotPasswordDto = new ForgotPasswordDto();
    f.email = this.f['email'].value;
    this.userService.getUserByEmail(f);
  }
}
