import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {

  constructor(  
    private route: ActivatedRoute,
    private router: Router
  ) {}

  toDemo1(): void {
    window.location.href = "http://oma.gonzalo-oberreuter.de"
  }

  toRepo1(): void {
    window.location.href = "https://github.com/darklambda/OMA"
  }

  toProject2(): void {
    this.router.navigate(['plots'], {relativeTo: this.route});
    //window.location.href = "https://github.com/darklambda/OMA"
  }

}
