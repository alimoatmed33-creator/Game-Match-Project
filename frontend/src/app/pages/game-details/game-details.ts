import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './game-details.html',
  styleUrls: ['./game-details.css']
})
export class GameDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private cdr = inject(ChangeDetectorRef);

  game: Game | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        console.log('GameDetails route param id:', id);

        if (!id) {
          this.errorMessage = 'Invalid game link.';
          this.isLoading = false;
          this.game = null;
          this.cdr.detectChanges();
          return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.cdr.detectChanges();

        this.gameService.getGameById(id).subscribe({
          next: (data: Game) => {
            console.log('Game Details received:', data);
            if (data) {
              this.game = data;
              this.errorMessage = '';
            } else {
              this.errorMessage = 'Game not found.';
              this.game = null;
            }
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            console.error('Error fetching game details:', err);
            this.errorMessage = err?.error?.message || 'Game not found.';
            this.isLoading = false;
            this.game = null;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

}