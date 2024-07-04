import { Component, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-open-cv',
  standalone: true,
  imports: [NgIf],
  templateUrl: './open-cv.component.html',
  styleUrl: './open-cv.component.css'
})
export class OpenCVComponent implements OnInit{
  
  private peer!: RTCPeerConnection;
  public webcamAvailable = true;
  public webcamOnUse = false;
  public mediaStream: MediaStream | undefined;
  public permissionsDenied = false;
  
  ngOnInit(): void {
    OpenCVComponent.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.webcamAvailable = mediaDevices && mediaDevices.length > 0;
    },
      (error) => this.webcamAvailable = false);
  }

  public onStart() {
    console.log("Starting stream")
    if (!this.mediaStream)
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream  => {
          this.mediaStream = stream;
          this.startWebRTC();
        })
        .catch( err => {
          console.log(err);
          this.onStop();
          this.permissionsDenied = true;
        });
    else console.log("Stream already on");
  }

  private startWebRTC() {
    this.createPeerConnection();
    console.log("Peer created");
    // Double check that video is available
    this.peer.addTrack(this.mediaStream!.getVideoTracks()[0]);
    console.log("Track added to peer");
    try {
      this.negotiate();
    } catch {
      this.onStop();
    }

  }

  private createPeerConnection() {
    const config: RTCConfiguration = {}

    const pc = new RTCPeerConnection(config);

    let tmp: MediaStream;

    // register some listeners to help debugging
    pc.addEventListener('icegatheringstatechange', function() {
        console.log("ice gathering state change", pc.iceGatheringState);
    }, false);

    pc.addEventListener('iceconnectionstatechange', function() {
      console.log("ice connection state change", pc.iceConnectionState);
    }, false);

    pc.addEventListener('signalingstatechange', function() {
      console.log("signaling state change", pc.signalingState);
    }, false);

    pc.addEventListener('track', function(event) {
      let remoteVideo = document.getElementsByTagName('video')[0]; //Change your remote 'video element' id here
      if (remoteVideo) remoteVideo.srcObject = event.streams[0];
    });

    this.peer = pc;
}

  private negotiate() {
  const pc = this.peer;
  pc.createOffer().then((offer) => {
      pc.setLocalDescription(offer);
  }).then(() => {
      // wait for ICE gathering to complete
      return new Promise<void>((resolve) => {
          if (pc.iceGatheringState === 'complete') {
              resolve();
          } else {
              function checkState() {
                  if (pc.iceGatheringState === 'complete') {
                      pc.removeEventListener('icegatheringstatechange', checkState);
                      resolve();
                  }
              }
              pc.addEventListener('icegatheringstatechange', checkState);
          }
      });
  }).then(() => {
      var offer = this.peer.localDescription;
      console.log("offer",offer)
      if (offer !== null)
      return fetch('http://localhost:8080/offer', {
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
  }).then(function(response) {
      return response.json();
  }).then(function(answer) {
      console.log("Answer", answer)
      pc.setRemoteDescription(answer);
  }).catch(function(e) {
      alert(e);
      throw e;
  });

}
  public onStop() {
    if (this.mediaStream) this.mediaStream.getTracks()[0].stop();
    else console.log("No stream");
    const pc = this.peer;
    if (pc) {
        pc.getTransceivers().forEach(function(transceiver) {
            if (transceiver && transceiver.stop) {
                transceiver.stop();
            }
        });
    }

    // close local audio / video
    if (pc)
      pc.getSenders().forEach(function(sender) {
        if (sender && sender.track) sender.track.stop();
      });

    // close peer connection
    setTimeout(function() {
      if (pc)
        pc.close();
    }, 500);
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
