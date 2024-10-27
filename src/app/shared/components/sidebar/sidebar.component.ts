import { Component, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapCalendarDate, bootstrapBookHalf, bootstrapPersonAdd, bootstrapWatch, bootstrapSun, bootstrapShare, bootstrapFeather,bootstrapGearWideConnected, bootstrapMagic } from '@ng-icons/bootstrap-icons';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [NgIconComponent, CommonModule, RouterModule],
  viewProviders: [provideIcons({ bootstrapCalendarDate, bootstrapBookHalf, bootstrapPersonAdd, bootstrapWatch, bootstrapSun, bootstrapShare, bootstrapFeather, bootstrapGearWideConnected, bootstrapMagic })]
})
export class SidebarComponent implements OnInit {

  today!: string;

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
  }
}
