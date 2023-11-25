import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {

toDemo(): void {
  window.location.href = "http://oma.gonzalo-oberreuter.de"
}

toRepo(): void {
  window.location.href = "https://github.com/darklambda/OMA"
}

}
