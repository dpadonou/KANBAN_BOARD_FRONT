import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddBoard } from '../entities/add-board';
import { BoardDto } from '../entities/boardDto';
import { ManyToOne } from '../entities/many-to-one';
import { OneToOne } from '../entities/one-to-one';

@Injectable({
  providedIn: 'root',
})
export class BoardServiceService {
  private configUrl = 'api/board';
  constructor(private http: HttpClient) {}
  create(b: AddBoard): Observable<any> {
    return this.http.post<any>(this.configUrl + '/full_save', b);
  }

  getAllUserBoard(userId: number) {
    return this.http.get<any>(this.configUrl + '/created-by/' + userId);
  }
  addSectionToBoard(m: OneToOne) {
    return this.http.put<any>(this.configUrl + '/addsection', m);
  }

  addManySectionToBoard(ma: ManyToOne) {
    return this.http.put<any>('api/board/addSection/many', ma);
  }
}
