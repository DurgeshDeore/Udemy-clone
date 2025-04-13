import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,  
  imports: [CommonModule],
  selector: 'app-course-video',
  template: `
    <div class="video-container">
      <div class="course-header">
        <h1 class="course-title">{{ courseTitle }}</h1>
        <div class="course-meta">
          <span class="instructor">Instructor: {{ courseInstructor }}</span>
          <span class="duration">Duration: {{ courseDuration }}</span>
        </div>
      </div>
      
      <div class="video-wrapper">
        <iframe 
          *ngIf="safeVideoUrl"
          [src]="safeVideoUrl"
          frameborder="0" 
          allowfullscreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
        </iframe>
        <div *ngIf="!safeVideoUrl" class="error-message">
          <i class="error-icon">⚠️</i>
          <p>Could not load video. Invalid URL: {{ videoUrl }}</p>
        </div>
      </div>
      
      <div class="course-description">
        <h3>About this course</h3>
        <p>{{ courseDescription }}</p>
      </div>
    </div>
  `,
  styles: [`
    .video-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1c1d1f;
    }
    
    .course-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .course-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #1c1d1f;
      line-height: 1.2;
    }
    
    .course-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.9rem;
      color: #6a6f73;
    }
    
    .course-meta span {
      display: flex;
      align-items: center;
    }
    
    .video-wrapper {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
      background-color: #000;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    
    .course-description {
      background-color: #f7f9fa;
      padding: 1.5rem;
      border-radius: 4px;
    }
    
    .course-description h3 {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #1c1d1f;
    }
    
    .course-description p {
      line-height: 1.6;
      color: #1c1d1f;
    }
    
    .error-message {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #f8d7da;
      color: #721c24;
      padding: 2rem;
      text-align: center;
    }
    
    .error-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    @media (max-width: 768px) {
      .video-container {
        padding: 1rem;
      }
      
      .course-title {
        font-size: 1.4rem;
      }
      
      .course-meta {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class CourseVideoComponent implements OnInit {
  safeVideoUrl: SafeResourceUrl | null = null;
  videoUrl: string = '';
  courseTitle: string = 'Loading...';
  courseDescription: string = '';
  courseInstructor: string = 'Unknown Instructor';
  courseDuration: string = '0 hours';

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.videoUrl = params['videoUrl'];
      this.courseTitle = params['title'] || 'Untitled Course';
      this.courseDescription = params['description'] || 'No description available';
      this.courseInstructor = params['instructor'] || 'Unknown Instructor';
      this.courseDuration = params['duration'] || '0 hours';
      
      const embedUrl = this.convertToEmbedUrl(this.videoUrl);
      if (embedUrl) {
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }
    });
  }

  private convertToEmbedUrl(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (!videoId) {
      console.error('Invalid YouTube URL:', url);
      return null;
    }
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
  }
}
