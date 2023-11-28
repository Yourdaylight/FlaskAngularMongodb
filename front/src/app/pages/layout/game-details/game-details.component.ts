import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigateService } from 'src/app/services/navigate.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
})
export class GameDetailsComponent implements OnInit {
  gameInfo: any = {};
  commentList: any = [];
  fps: any = '';
  editForm!: FormGroup;
  editField: any = [
    {
      label: 'Title',
      value: 'Title',
    },
    {
      label: 'Original Price',
      value: 'Original Price',
    },
    {
      label: 'Discounted Price',
      value: 'Discounted Price',
    },
    {
      label: 'Developer',
      value: 'Developer',
    },
    {
      label: 'Publisher',
      value: 'Publisher',
    },
    {
      label: 'Release Date',
      value: 'Release Date',
    },
    {
      label: 'Game Description',
      value: 'Game Description',
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
    this.gameInfo = JSON.parse(localStorage.getItem('gameInfo') as any);
    this.editForm = this.fb.group({
      Title: [null, [Validators.required]],
      'Original Price': [null, [Validators.required]],
      'Discounted Price': [null, [Validators.required]],
      Developer: [null, [Validators.required]],
      Publisher: [null, [Validators.required]],
      'Release Date': [null, [Validators.required]],
      'Game Description': [null, [Validators.required]],
    });
    this.getCommentList();
  }

  getCommentList(): void {
    this.apiService
      .post('/getReviews', {
        gameId: this.gameInfo._id,
      })
      .subscribe(
        (res: any) => {
          const { code, data } = res;
          if (code == 200) {
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
      review: this.commentValue,
      _id: this.gameInfo._id,
    };
    this.apiService.post('/addReview', params).subscribe(
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
      review_id: comment.review_id,
      gameId: this.gameInfo._id,
    };
    this.apiService.post('/deleteReview', params).subscribe(
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
      gameId: this.gameInfo._id,
    };
    this.apiService.post('/games/collectGame', params).subscribe(
      (res: any) => {
        this.$message.success('collected!');
        this.router.navigate(['/layout/favorite'], {});
      },
      () => {}
    );
  }

  onDelete() {
    this.apiService
      .post('/game/deleteGame', { _id: this.gameInfo._id })
      .subscribe(
        (res: any) => {
          this.$message.success(`delete ${this.gameInfo.title} success!`);
          this.router.navigate(['/layout/list'], {});
        },
        () => {}
      );
  }
  onEdit() {
    this.isVisible = true;
    this.editForm.patchValue(this.gameInfo);
  }
  submitForm(): void {
    if (this.editForm.valid) {
      let params = { ...this.editForm.value, _id: this.gameInfo._id };
      this.apiService.post('/game/updateGame', params).subscribe(
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
