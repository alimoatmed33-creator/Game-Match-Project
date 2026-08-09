import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { GameDetails } from './pages/game-details/game-details';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'game/:id',
    component: GameDetails
  }
];


