import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SystemMetricsService } from '../../core/services/system-metrics-service';
import { BytesPipe } from '../../shared/pipes/bytes-pipe';

@Component({
  selector: 'app-side-bar-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive, BytesPipe],
  templateUrl: './side-bar-menu.html',
  styleUrl: './side-bar-menu.scss'
})
export class SideBarMenu {

  metricsSvc = inject(SystemMetricsService);
  loading: boolean | undefined;

}
