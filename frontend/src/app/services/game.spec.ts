import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private http = inject(HttpClient);

  private api = 'http://localhost:3000/api/games';

  getGames(): Observable<Game[]> {

    return this.http.get<Game[]>(this.api);

  }

}