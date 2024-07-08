import { Component, OnInit} from '@angular/core';
import { NgIf } from '@angular/common';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationStart, Router } from '@angular/router';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';


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
    .catch( () => {
      this.working = false;
      this.onStop();
      this.message = "Error while getting the video track...";
      this.permissionsDenied = true;
    });
    
  }

  private startWebRTC() {
    this.createPeerConnection();
    this.peer.addTrack(this.mediaStream!.getVideoTracks()[0]);
    this.negotiateConnection();
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
        if (offer !== null) {
          const socket = new WebSocket(environment.WEB_RTC);
          return new Promise<string>((res, rej) => {
            socket.addEventListener("message", (event) => {
              const wsMessage: string = event.data
              if (wsMessage.startsWith("1-")) {
                socket.send(JSON.stringify({
                  sdp: offer.sdp,
                  type: offer.type,
                  video_transform: 'edges' // TODO - Change in the future if necessary
                }));
              } else if (wsMessage.startsWith("2-")){
                const remaining = wsMessage.slice(2)
                this.message = `Waiting for an WebRTC connection. ${remaining} users ahead in the queue.`
              } else {
                res(wsMessage);
              }
            });
            socket.addEventListener("close", (event) => {
              console.log(event)
              rej(event)
            });
          })
        }
        throw new Error("Empty Offer");
    }).then((answer) => {
        const parsedAnswer = JSON.parse(answer);
        console.log("Answer Description", parsedAnswer)
        if (pc) pc.setRemoteDescription(parsedAnswer);
    }).catch((error) => {
        this.onStop();
        if (error instanceof CloseEvent) {
          if (error.wasClean) this.message = "Maximum Connection Reached. Try later.";
          else this.message = "Signaling Server not Available.";
        }
          
        else this.message = "Error while generating RTC peer...";

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
