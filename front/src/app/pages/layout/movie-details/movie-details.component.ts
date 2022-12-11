import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigateService } from 'src/app/services/navigate.service';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  movieInfo: any = {};
  commentList: any = [];
  fps: any = '';
  editForm!: FormGroup;
  editField: any = [
    {
      label: 'Title',
      value: 'title',
    },
    {
      label: 'Type',
      value: 'type',
    },
    {
      label: 'Director',
      value: 'director',
    },
    {
      label: 'Cast',
      value: 'cast',
    },
    {
      label: 'Country',
      value: 'country',
    },
    {
      label: 'Release year',
      value: 'release_year',
    },
    {
      label: 'Duration',
      value: 'duration',
    },
    {
      label: 'Listed in',
      value: 'listed_in',
    },
    {
      label: 'Description',
      value: 'description',
    },
    {
      label: 'Image Url',
      value: 'pic_url',
    },
  ];
  isVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private $message: NzMessageService,
    private navigateService: NavigateService,
    public router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.movieInfo = JSON.parse(localStorage.getItem('movieInfo') as any);
    this.editForm = this.fb.group({
      title: [null, [Validators.required]],
      type: [null, [Validators.required]],
      director: [null, [Validators.required]],
      cast: [null, [Validators.required]],
      country: [null, [Validators.required]],
      release_year: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      listed_in: [null, [Validators.required]],
      description: [null, [Validators.required]],
      pic_url: [null, [Validators.required]],
    });
    this.getCommentList();
  }

  getCommentList(): void {
    this.apiService
      .post('getComments', {
        username: localStorage.getItem('username'),
        movie_id: this.movieInfo._id,
      })
      .subscribe(
        (res: any) => {
          const { code, data } = res;
          if (code == 0) {
            this.commentList = data;
            this.submitting = false;
          }
        },
        () => {}
      );
  }

  submitting = false;
  commentValue = '';

  handleSubmit(): void {
    this.submitting = true;

    let params = {
      username: localStorage.getItem('username'),
      comment: this.commentValue,
      _id: this.movieInfo._id,
    };
    this.apiService.post('addComment', params).subscribe(
      (res: any) => {
        this.commentValue = '';
        this.getCommentList();
      },
      () => {}
    );
  }

  removeComment(comment: any): void {
    this.submitting = true;
    let params = {
      comment_id: comment.comment_id,
    };
    this.apiService.post('deleteComment', params).subscribe(
      (res: any) => {
        this.commentValue = '';
        this.getCommentList();
      },
      () => {}
    );
  }

  onCollect() {
    let params = {
      username: localStorage.getItem('username'),
      _id: this.movieInfo._id,
    };
    this.apiService.post('addFavorite', params).subscribe(
      (res: any) => {
        this.$message.success('已收藏');
        this.router.navigate(['/layout/favorite'], {});
      },
      () => {}
    );
  }

  onDelete() {
    this.apiService.post('deleteMovie', { _id: this.movieInfo._id }).subscribe(
      (res: any) => {
        this.$message.success(`delete ${this.movieInfo.title} success!`);
        this.router.navigate(['/layout/list'], {});
      },
      () => {}
    );
  }
  onEdit() {
    this.isVisible = true;
    this.editForm.patchValue(this.movieInfo);
  }
  submitForm(): void {
    if (this.editForm.valid) {
      let params = { ...this.editForm.value, _id: this.movieInfo._id };
      this.apiService.post('updateMovie', params).subscribe(
        (res: any) => {
          this.isVisible = false;
          this.$message.success(`edit success!`);
          this.router.navigate(['/layout/list'], {});
        },
        () => {}
      );
    } else {
      Object.values(this.editForm.controls).forEach((control: any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
