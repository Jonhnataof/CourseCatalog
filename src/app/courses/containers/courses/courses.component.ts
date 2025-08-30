import { Component, OnInit } from '@angular/core';
import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses$: Observable<Course[]>;


  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {

    this.courses$ = this.coursesService.list().
    pipe(
      catchError(error => {
        this.onError('Erro ao carregar cursos.')
        return of([])
      })
    )
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }


  ngOnInit(): void {

  }

  public addCourses(){
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  public editCourses(course: Course){
    this.router.navigate(['edit', course._id], {relativeTo: this.route})
  }

  public deleteCourse(course: Course){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Deseja realmente deletar o curso ${course.name}?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coursesService.delete(course).subscribe({
          next: () => {
            this.courses$ = this.coursesService.list().pipe(
              catchError(error => {
                this.onError('Erro ao carregar cursos.');
                return of([]);
              })
            );
            this.snackBar.open('Curso deletado com sucesso!', '', {duration: 3000});
          },
          error: () => this.onError('Erro ao deletar o curso.')
        });
      }
    });
  }

}
