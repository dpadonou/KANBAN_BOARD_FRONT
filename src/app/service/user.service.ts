import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { first, Observable, Subject } from 'rxjs';
import { AddUser } from '../entities/addUser';
import { ForgotPasswordDto } from '../entities/forgot-passwordDto';
import { LoginUser } from '../entities/login-user';
import { User } from '../entities/user';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userForgot!: User;
  private configUrl: String = 'api/';
  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router
  ) {}

  register(user: AddUser): Observable<any> {
    return this.http.post<any>(this.configUrl + 'user', user);
  }
  getUserByEmail(forgot: ForgotPasswordDto) {
    this.alertService.clear();
    this.http
      .post<any>(this.configUrl + 'user/forgotPassword', forgot)
      .pipe(first())
      .subscribe(
        (data) => {
          this.userForgot = data;
          this.router.navigate(['/resetPassword']);
        },
        (error) => {
          this.alertService.error("Cet utilisateur n'existe pas!");
        }
      );
  }
  updateUser(user: AddUser, id: number): Observable<any> {
    return this.http.put<any>(this.configUrl + 'user/' + id, user);
  }
  public get userForgotValue(): User {
    return this.userForgot;
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.configUrl + 'user');
  }

  deleteUser(userId: number) {
    return this.http.delete<any>(this.configUrl + 'user/' + userId);
  }
}
