import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-old-layout',
  imports: [RouterOutlet, RouterModule, MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './old-layout.component.html',
  styleUrl: './old-layout.component.css',
})
export class OldLayoutComponent {
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
