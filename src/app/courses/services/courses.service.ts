import { Injectable } from '@angular/core';
import { Course } from '../model/course';

import { HttpClient } from '@angular/common/http';
import { delay, first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = '/api/courses';

  constructor(private httpClient: HttpClient) { }

  public list() {
    return this.httpClient.get<Course[]>(this.API)
    .pipe(
      first(),
      delay(1000)
    );
  }

  public save (course: Partial<Course>){
    if (course._id){
      return this.upDate(course);
    }
    return this.create(course);
  };

  public loadById(id: string){
    return this.httpClient.get<Course>(`${this.API}/${id}`);
  }

  private create(course: Partial<Course>){
    return this.httpClient.post<Course>(this.API, course).pipe(first());
  }

  private upDate(course: Partial<Course>){
    return this.httpClient.put<Course>(`${this.API}/${course._id}`, course).pipe(first());
  }
}
