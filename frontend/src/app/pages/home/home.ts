import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  private gameService = inject(GameService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  games: Game[] = [];
  filteredGames: Game[] = [];
  genres: string[] = [];
  selectedGenre = '';
  searchText = '';

  ngOnInit(): void {
    this.gameService.getGames().subscribe({
      next: (data) => {
        console.log('Games:', data);
        this.games = data;
        this.filteredGames = data;
        this.genres = [...new Set(data.map(game => game.genre))].sort();
        console.log('games =', this.games.length);
        console.log('filtered =', this.filteredGames.length);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  searchGames(): void {
    const query = this.searchText.trim().toLowerCase();

    if (!query) {
      this.filteredGames = this.selectedGenre ? this.filteredGames : [...this.games];
      return;
    }

    const source = this.selectedGenre ? this.filteredGames : this.games;

    this.filteredGames = source.filter((game) =>
      game.name.toLowerCase().includes(query) ||
      game.genre.toLowerCase().includes(query) ||
      game.publisher.toLowerCase().includes(query)
    );
  }

  applyGenreFilter(genre: string): void {
    this.selectedGenre = genre;

    if (!genre) {
      this.filteredGames = [...this.games];
      return;
    }

    this.gameService.filterGames(genre).subscribe({
      next: (data) => {
        this.filteredGames = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  trackById(index: number, game: Game): string | undefined {
    return game._id;
  }

  viewDetails(game: Game): void {
    if (!game._id) {
      return;
    }

    this.router.navigate(['/game', game._id]);
  }

}