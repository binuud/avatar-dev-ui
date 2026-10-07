import { Routes } from '@angular/router';
import { AiChatPage } from './pages/ai-chat-page/ai-chat-page';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'chat', component: AiChatPage },
];

