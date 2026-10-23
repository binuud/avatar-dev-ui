import { Routes } from '@angular/router';
import { AiChatPage } from './pages/ai-chat-page/ai-chat-page';
import { HomePage } from './pages/home-page/home-page';
import { AvatarPage } from './pages/avatar-page/avatar-page';
import { AvatarRun } from './lib/avatar/avatar-run/avatar-run';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'chat', component: AiChatPage },
  { path: 'avatars', component: AvatarPage },
  { path: 'avatar/:id', component: AvatarRun },
];

