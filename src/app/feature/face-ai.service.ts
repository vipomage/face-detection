import { Injectable } from '@angular/core';

declare const faceapi: any;

@Injectable({
  providedIn: 'root',
})
export class FaceAiService {
  faceApi = faceapi;

  models: Promise<void>[] = [
    faceapi.nets.tinyFaceDetector.loadFromUri('./assets/ai-models/'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./assets/ai-models/'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./assets/ai-models/'),
    faceapi.nets.faceExpressionNet.loadFromUri('./assets/ai-models/'),
  ];

  videoOpts: MediaStreamConstraints = {
    video: {
      width: 1280,
      height: 720,
      frameRate: 100,
      noiseSuppression: true,
    },
    audio: false,
  };

  async startVideo(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia(this.videoOpts);
  }
}
