import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { AddSection } from '../entities/add-section';
import { OneToOne } from '../entities/one-to-one';
import { Section } from '../entities/section';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private configUrl = 'api/section';
  constructor(private http: HttpClient) {}

  getAllSections(): Observable<any> {
    return this.http.get<any>(this.configUrl);
  }

  save(s: AddSection): Observable<any> {
    return this.http.post<any>(this.configUrl, s);
  }
}
