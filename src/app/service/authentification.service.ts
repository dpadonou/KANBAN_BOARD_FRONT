import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BoardDto } from '../entities/boardDto';
import { LoginUser } from '../entities/login-user';
import { UserDto } from '../entities/userDto';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private currentUserSubject: BehaviorSubject<UserDto>;
  public currentUser: Observable<UserDto>;
  private currentBoardSubject: BehaviorSubject<BoardDto>;
  public currentBoard: Observable<BoardDto>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserDto>(
      JSON.parse(localStorage.getItem('currentUser')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentBoardSubject = new BehaviorSubject<BoardDto>(
      JSON.parse(localStorage.getItem('currentBoard')!)
    );
    this.currentBoard = this.currentBoardSubject.asObservable();
  }

  public get currentUserValue(): UserDto {
    return this.currentUserSubject.value;
  }

  public get currentBoardValue(): BoardDto {
    return this.currentBoardSubject.value;
  }

  public setCurrentBoardValue(board: BoardDto) {
    localStorage.setItem('currentBoard', JSON.stringify(board));
    this.currentBoardSubject.next(board);
  }

  login(loginUser: LoginUser, isRemember: boolean) {
    return this.http.post<any>(`api/user/login`, loginUser).pipe(
      map((user: UserDto) => {
        if (isRemember) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        } else {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      })
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentBoard');
    this.currentUserSubject.next(undefined!);
    this.currentBoardSubject.next(undefined!);
  }
}
