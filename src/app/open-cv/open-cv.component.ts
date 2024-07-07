import { Component, OnInit} from '@angular/core';
import { NgIf } from '@angular/common';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationStart, Router } from '@angular/router';


@Component({
  selector: 'app-open-cv',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './open-cv.component.html',
  styleUrl: './open-cv.component.css'
})
export class OpenCVComponent implements OnInit{

  constructor(private router: Router) {}
  
  private peer!: RTCPeerConnection;

  public webcamAvailable = true;
  public webcamOnUse = false;
  public permissionsDenied = false;
  public start = true;
  public working = false;
  public message = "Ready to start WebRTC connection!";

  public mediaStream: MediaStream | undefined;
  public streamAvailable: boolean = false;
  
  ngOnInit(): void {
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && !this.start) this.onStop();
    });

    OpenCVComponent.getAvailableVideoInputs()
    .then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.webcamAvailable = mediaDevices.length > 0;
      },
      () => this.webcamAvailable = false);
  }

  public onStart() {
    
    this.start = false;
    this.working = true;
    this.message = "Waiting for server..."
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream  => {
      this.mediaStream = stream;
      this.startWebRTC();
    })
    .catch( err => {
      this.working = false;
      console.log(err);
      this.onStop();
      this.message = "Error while getting the video track...";
      this.permissionsDenied = true;
    });
    
  }

  private startWebRTC() {
    this.createPeerConnection();
    this.peer.addTrack(this.mediaStream!.getVideoTracks()[0]);
    try {
      this.negotiateConnection();
    } catch {
      this.message = "Error while generating RTC peer...";
      this.onStop();
    }
  }

  private createPeerConnection() {
    const pc = new RTCPeerConnection();

    pc.addEventListener('icegatheringstatechange', 
      () => { console.log("Ice Gathering State Change", pc.iceGatheringState) }, 
      false
    );

    pc.addEventListener('iceconnectionstatechange', 
      () => { 
        console.log("Ice Connection State Change", pc.iceConnectionState);
        if (pc.iceConnectionState === 'disconnected') {
          this.onStop();
          this.message = "RTC connection closed by server";
        }
      },
      false
    );

    pc.addEventListener('signalingstatechange', 
      () => { console.log("Signaling State Change", pc.signalingState) },
      false
    );

    pc.addEventListener('track', 
      (event) => {
        let remoteVideo = document.getElementsByTagName('video')[0];
        if (remoteVideo) {
          this.streamAvailable = true;
          this.working = false;
          this.message = "Live video stream connected!";
          remoteVideo.srcObject = event.streams[0];
        } 
    });

    this.peer = pc;
  }

  private negotiateConnection() {

    const pc = this.peer;

    pc.createOffer().then(
      (offer) => pc.setLocalDescription(offer)
    ).then(() => new Promise<void>(
                  (resolve) => {
                    if (pc.iceGatheringState === 'complete') resolve();
                    else {
                        function checkState() {
                            if (pc.iceGatheringState === 'complete') {
                                pc.removeEventListener('icegatheringstatechange', checkState);
                                resolve();
                            }
                        }
                        pc.addEventListener('icegatheringstatechange', checkState);
                    }
                })
    ).then(() => {
        let offer = this.peer.localDescription;
        if (offer !== null)
        return fetch(environment.WEB_RTC, {
            body: JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
                video_transform: 'edges'
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
        throw new Error("Empty Body");
    }).then((response) => response.json()
    ).then((answer) => {
        console.log("Answer Description", answer)
        if (pc) pc.setRemoteDescription(answer);
    }).catch((error) => {
        this.working = false;
        this.onStop();
        this.message = "Error connecting to server...";
        throw error;
    });
  }

  public onStop() {
    this.working = false;
    this.start = true;
    this.streamAvailable = false;
    let remoteVideo = document.getElementsByTagName('video')[0];
    if (remoteVideo && remoteVideo.srcObject) remoteVideo.srcObject = null;

    if (this.mediaStream) this.mediaStream.getTracks()[0].stop();

    const pc = this.peer;

    if (pc) {
        pc.getTransceivers().forEach((transceiver) => {
          if (transceiver && transceiver.sender) transceiver.stop();  
        });
        pc.getSenders().forEach((sender) => {
          if (sender && sender.track) sender.track.stop();
        });
        pc.close();
    }
    this.message = "Ready to start WebRTC connection!";
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
