import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trajectory',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule],
  templateUrl: './trajectory.component.html',
  styleUrl: './trajectory.component.css'
})
export class TrajectoryComponent { 

  events = [];
  
}
