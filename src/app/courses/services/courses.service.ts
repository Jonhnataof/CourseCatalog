import { Injectable } from '@angular/core';
import { Course } from '../model/course';

import { HttpClient } from '@angular/common/http';
import { delay, first, tap } from 'rxjs/operators';
import { CoursesComponent } from '../courses/courses.component';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = '/api/courses';

  constructor(private httpClient: HttpClient) { }

  list() {
    return this.httpClient.get<Course[]>(this.API)
    .pipe(
      first(),
      delay(2000)
    );
  }

  save (course: CoursesComponent){
    return this.httpClient.post<Course>(this.API, course)
  };
}
