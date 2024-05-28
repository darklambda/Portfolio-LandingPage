import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({ selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css', imports: [CommonModule, RouterOutlet, MatToolbarModule,
        MatMenuModule, MatButtonModule, RouterLink, MatIconModule], 
})
export class AppComponent {

  toGithub(): void {
    window.location.href = "http://github.com/darklambda"
  }
  
  toLinkedin(): void {
    window.location.href = "http://linkedin.com/in/gonzalo-oberreuter-alvarez"
  }

  toInstagram(): void {
    window.location.href = "https://www.instagram.com/el.obe"
  }

  title = 'Home';
}
