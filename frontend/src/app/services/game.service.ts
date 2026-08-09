import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Game } from '../models/game';

interface GamesResponse {
  success: boolean;
  count: number;
  data: Game[];
}

interface GameResponse {
  success: boolean;
  data: Game;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private http = inject(HttpClient);

  private baseUrl = '/api/games';

  getGames(): Observable<Game[]> {

    return this.http
      .get<GamesResponse>(this.baseUrl)
      .pipe(
        map(response => response.data)
      );

  }

  filterGames(genre: string): Observable<Game[]> {
    const params = new HttpParams().set('genre', genre);

    return this.http
      .get<GamesResponse>(`${this.baseUrl}/filter`, { params })
      .pipe(
        map(response => response.data)
      );
  }

  getGameById(id: string): Observable<Game> {

    return this.http
      .get<GameResponse>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );

  }

}