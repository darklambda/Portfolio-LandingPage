import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';


@Component({
  selector: 'app-trajectory',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './trajectory.component.html',
  styleUrl: './trajectory.component.css'
})
export class TrajectoryComponent {
  events = [];
  
}
