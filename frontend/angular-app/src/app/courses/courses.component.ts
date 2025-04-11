// src/app/courses/courses.component.ts
import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course } from '../models/course.model';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  standalone: true,
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  imports: [CommonModule, HeaderComponent, FooterComponent, NavbarComponent]
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(
    private coursesService: CoursesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe((data: Course[]) => {
      this.courses = data;
    });
  }

  navigateToCourseVideo(course: Course) {
    this.router.navigate(['/course-video'], { 
      queryParams: { 
        videoUrl: course.videoLink,
        title: course.title,
        description: course.description
      }
    });
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CoursesService } from '../services/courses.service';
// import { Course } from '../models/course.model';
// import { HeaderComponent } from '../header/header.component';
// import { FooterComponent } from '../footer/footer.component';
// import { NavbarComponent } from '../navbar/navbar.component';

// @Component({
//   selector: 'app-courses',
//   templateUrl: './courses.component.html',
//   styleUrls: ['./courses.component.css'],
//   imports: [HeaderComponent,FooterComponent,NavbarComponent]
// })
// export class CoursesComponent implements OnInit {
//   courses: Course[] = [];

//   constructor(private coursesService: CoursesService) {}

//   ngOnInit(): void {
//     this.loadCourses();
//   }

//   loadCourses() {
//     this.coursesService.getCourses().subscribe((data) => {
//       this.courses = data;
//     });
//   }
// }
