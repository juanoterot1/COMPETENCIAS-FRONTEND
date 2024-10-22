// loading-bar.component.ts
import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from '../../core/services/api/loading-bar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-bar',
  standalone:true,
  imports:[CommonModule],
  template: `
    <div *ngIf="isLoading" class="loading-bar"></div>
  `,
  styles: [`
    .loading-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: linear-gradient(90deg, #3498db, #e74c3c);
      background-size: 200% 100%;
      animation: loadingAnimation 2s linear infinite;
      z-index: 10000;
    }

    @keyframes loadingAnimation {
      0% { width: 0%; }
      50% { width: 50%; background-position: 100% 0%; }
      100% { width: 100%; background-position: 0% 0%; }
    }
  `]
})
export class LoadingBarComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private loadingBarService: LoadingBarService) {}

  ngOnInit(): void {
    this.loadingBarService.isLoading$.subscribe((loading) => {

      this.isLoading = loading;
    });
  }
}