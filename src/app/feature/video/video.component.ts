import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FaceAiService } from '../face-ai.service';
// import { resizeResults } from 'face-api.js';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  videoOptions = {
    width: 1280,
    height: 720,
    autoplay: true,
    muted: true,
    controls: false,
  };
  videoStream: MediaStream | undefined;
  canvas!: HTMLCanvasElement;

  constructor(public faceAiService: FaceAiService) {}

  async ngOnInit(): Promise<void> {
    await Promise.all(this.faceAiService.models);
    this.videoStream = await this.faceAiService.startVideo();

    setTimeout(() => {
      this.videoElement.nativeElement.addEventListener('play', async () => {
        await this.pooling();
      });
    });
  }

  async pooling(): Promise<void> {
    const { width, height } = this.videoElement.nativeElement;
    const displaySize = { width: 1280, height: 720 };

    this.canvas = await this.faceAiService.faceApi.createCanvasFromMedia(
      this.videoElement.nativeElement
    );

    this.faceAiService.faceApi.matchDimensions(this.canvas, displaySize);

    const faceDetector = new this.faceAiService.faceApi.TinyFaceDetectorOptions();

    this.canvas.setAttribute('class', 'detections');
    Object.assign(this.canvas.style, {
      position: 'absolute',
      width: '1280px',
      height: '720px',
    });

    setInterval(async () => {
      const faceDetections = await this.faceDetection(faceDetector);

      const resizedDetections = this.faceAiService.faceApi.resizeResults(
        faceDetections,
        displaySize
      );

      // @ts-ignore
      this.canvas.getContext('2d').clearRect(0, 0, width, height);

      this.container.nativeElement.append(this.canvas);

      this.faceAiService.faceApi.draw.drawDetections(
        this.canvas,
        resizedDetections
      );

      this.faceAiService.faceApi.draw.drawFaceLandmarks(
        this.canvas,
        resizedDetections
      );

      this.faceAiService.faceApi.draw.drawFaceExpressions(
        this.canvas,
        resizedDetections
      );
    }, 200);
  }

  async faceDetection(faceDetector: any): Promise<void> {
    return await this.faceAiService.faceApi
      .detectAllFaces(this.videoElement.nativeElement, faceDetector)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors();
  }
}
