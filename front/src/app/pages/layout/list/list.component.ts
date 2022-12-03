import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NavigateService} from 'src/app/services/navigate.service';
import {ApiService} from 'src/app/services/api.service';
import {Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd/modal';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {NzFormTooltipIcon} from 'ng-zorro-antd/form';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  searchValue: string = '';
  musicList: any = [];
  loading: boolean = true;
  isVisible: boolean = false;
  addForm!: FormGroup;
  addMusicList: any = [];

  constructor(
    private apiService: ApiService,
    private $message: NzMessageService,
    private navigateService: NavigateService,
    public router: Router,
    private modalService: NzModalService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      picUrl: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      artist: [null, [Validators.required]],
    });
    this.getMusicList();
  }

  submitForm(): void {
    if (this.addForm.valid) {
      console.log('submit', this.addForm.value);
      this.apiService.post('addSong',this.addForm.value).subscribe(
        (res: any) => {
          this.isVisible = false;
          this.getMusicList();
          this.$message.success('add success!');
        },
        () => {
        }
      );
    } else {
      Object.values(this.addForm.controls).forEach((control: any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  onSearch() {
    if (this.searchValue != '') {
      this.musicList = this.musicList.filter(
        (item: any) => item.name.includes(this.searchValue) || item.artist.includes(this.searchValue)
      );
    } else {
      this.getMusicList();
    }
  }

  onCollect(data: any) {
    let params = {
      username: localStorage.getItem('username'),
      name: data.name,
    };
    this.apiService.post('collect', params).subscribe(
      (res: any) => {
        this.router.navigate(['/layout/favorite'], {});
      },
      () => {
      }
    );
  }
  onDelete(data: any) {
    this.apiService.post('deleteSong', data).subscribe(
      (res: any) => {
          this.getMusicList()
          this.$message.success(`delete ${data.name} success!`);
      },
      () => {
      }
    );
  }
  toDetail(data: any) {
    this.router.navigate(['/layout/music-details'], {
      queryParams: {
        name: data.name,
        artist: data.artist,
        albumPicUrl: data.album.picUrl,
        albumName: data.album.name,
        duration: data.duration,
      },
    });
  }

  getMusicList() {
    this.apiService.post('musicList', {}).subscribe(
      (res: any) => {
        this.loading = false;
        const {code, data} = res;
        if (code == 0) {
          this.musicList = data;
          this.musicList.forEach((item: any, index: number) => {
            let artists = item.artists.map((art: any) => art.name);
            item.artist = artists.join(', ');
            item.idx = index;
          });
          this.musicList = [...this.addMusicList, ...this.musicList];
          console.log("this.musicList", this.musicList[0]);
        } else {
          this.musicList = [];
        }
      },
      () => {
        this.loading = false;
      }
    );
  }
}
