import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { addDays, formatDistance } from 'date-fns';

@Component({
  selector: 'app-music-details',
  templateUrl: './music-details.component.html',
  styleUrls: ['./music-details.component.scss'],
})
export class MusicDetailsComponent implements OnInit {
  musicInfo: any = {};
  commentList: any = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.musicInfo = this.route.queryParams;
    this.getCommentList();
  }

  getCommentList(): void {
    this.apiService
      .post('getComments', {
        username: localStorage.getItem('username'),
        game_id: this.musicInfo._value._id,
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
      name: this.musicInfo._value.name,
      _id: this.musicInfo._value._id,
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
    console.log('666');
    console.log(comment);
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
}
