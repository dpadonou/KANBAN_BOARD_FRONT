import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private user_id: Subject<number> = new Subject<number>();
  constructor() {
    this.user_id.next(0);
  }

  getUser(): Subject<number> {
    return this.user_id;
  }
}
