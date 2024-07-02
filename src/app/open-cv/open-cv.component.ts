import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { SimplePeer } from 'simple-peer';

@Component({
  selector: 'app-open-cv',
  standalone: true,
  imports: [NgIf],
  templateUrl: './open-cv.component.html',
  styleUrl: './open-cv.component.css'
})
export class OpenCVComponent implements OnInit{
  
  private peer!: SimplePeer;
  public webcamsAvailable = false;
  
  ngOnInit(): void {
    OpenCVComponent.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.webcamsAvailable = mediaDevices && mediaDevices.length > 0;
    });
  }

  public static getAvailableVideoInputs(): Promise<MediaDeviceInfo[]> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return Promise.reject('enumerateDevices() not supported.');
    }

    return new Promise((resolve, reject) => {
      navigator.mediaDevices.enumerateDevices()
        .then((devices: MediaDeviceInfo[]) => {
          resolve(devices.filter((device: MediaDeviceInfo) => device.kind === 'videoinput'));
        })
        .catch(err => {
          reject(err.message || err);
        });
    });
  }

}
