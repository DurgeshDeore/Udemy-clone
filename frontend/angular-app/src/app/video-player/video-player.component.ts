// video-player.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-player',
  template: `
    <div class="video-container" *ngIf="showVideo">
      <div class="video-overlay" (click)="closeVideo()"></div>
      <div class="video-wrapper">
        <button class="close-btn" (click)="closeVideo()">&times;</button>
        <video controls>
          <source [src]="videoUrl" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  `,
  styles: [`
    .video-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .video-wrapper {
      position: relative;
      width: 80%;
      max-width: 800px;
    }
    .close-btn {
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
    }
    video {
      width: 100%;
      max-height: 80vh;
    }
  `]
})
export class VideoPlayerComponent {
  @Input() videoUrl: string = '';
  showVideo: boolean = false;

  openVideo(url: string) {
    this.videoUrl = url;
    this.showVideo = true;
    document.body.style.overflow = 'hidden';
  }

  closeVideo() {
    this.showVideo = false;
    document.body.style.overflow = '';
  }
}