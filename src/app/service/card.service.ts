import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddCard } from '../entities/add-card';
import { AddFullCardDto } from '../entities/add-full-card-dto';
import { OneToOne } from '../entities/one-to-one';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  configUrl = 'api/card';
  constructor(private http: HttpClient) {}

  createCard(card: AddFullCardDto): Observable<any> {
    return this.http.post<any>(this.configUrl + '/full_save', card);
  }

  findCardByBoardAndSection(section: number, board: number): Observable<any> {
    return this.http.get<any>(
      this.configUrl + '/board/' + board + '/section/' + section
    );
  }
  assignUserToCard(obj: OneToOne): Observable<any> {
    return this.http.put<any>(this.configUrl + '/assignTo', obj);
  }

  updateCard(id: number, card: AddCard): Observable<any> {
    return this.http.put<any>(this.configUrl + '/' + id, card);
  }

  moveCard(dto: OneToOne): Observable<any> {
    return this.http.put<any>(this.configUrl + '/moveTo', dto);
  }

  findByUserId(userId: number): Observable<any> {
    return this.http.get<any>(this.configUrl + '/user/' + userId);
  }

  deleteCard(cardId: number): Observable<any> {
    return this.http.delete<any>(this.configUrl + '/' + cardId);
  }
}
