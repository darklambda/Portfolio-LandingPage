import { Component } from '@angular/core';
import { StlModelViewerComponent } from 'angular-stl-model-viewer';
import { MatButtonModule } from '@angular/material/button';
import { PerspectiveCamera, Vector3 } from 'three';

@Component({
  selector: 'app-rp-camera',
  standalone: true,
  imports: [StlModelViewerComponent, MatButtonModule],
  templateUrl: './rp-camera.component.html',
  styleUrl: './rp-camera.component.css'
})
export class RPCameraComponent {

  cameras: PerspectiveCamera[] = [];

  constructor() {
    for (let i = 0; i < 4; i++) {
      this.cameras.push(new PerspectiveCamera(55, 1, 1, 15));
      this.cameras[i].position.set(0, 3, 3);
      this.cameras[i].lookAt(new Vector3(0,0,0));
    }
    
  }
  
}
