import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigateService } from 'src/app/services/navigate.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NzFormTooltipIcon } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  musicList: any = [];
  loading: boolean = true;
  isVisible: boolean = false;
  addForm!: FormGroup;
  addMusicList: any = [];
  page: number = 1;
  size: number = 9;
  total: number = 10;
  search: string = '';
  editId: any = null;

  constructor(
    private apiService: ApiService,
    private $message: NzMessageService,
    private navigateService: NavigateService,
    public router: Router,
    private modalService: NzModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      img_src: [null, [Validators.required]],
      fps: [null, [Validators.required]],
    });
    this.getMusicList();
  }

  submitForm(): void {
    if (this.addForm.valid) {
      let url = this.editId ? 'updateGame' : 'addGame';
      let params = { ...this.addForm.value };
      if (this.editId) params._id = this.editId;
      this.apiService.post(url, params).subscribe(
        (res: any) => {
          this.isVisible = false;
          this.getMusicList();
          this.$message.success(`${this.editId ? 'edit' : 'add'} success!`);
          this.editId = null;
        },
        () => {}
      );
    } else {
      Object.values(this.addForm.controls).forEach((control: any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onSearch() {
    this.page = 1;
    this.size = 9;
    this.getMusicList();
  }
  searchValue(searchValue: any): any {
    throw new Error('Method not implemented.');
  }

  onCollect(data: any) {
    let params = {
      username: localStorage.getItem('username'),
      _id: data._id,
    };
    this.apiService.post('addFavorite', params).subscribe(
      (res: any) => {
        this.router.navigate(['/layout/favorite'], {});
      },
      () => {}
    );
  }
  onDelete(data: any) {
    this.apiService.post('deleteGame', { _id: data._id }).subscribe(
      (res: any) => {
        this.getMusicList();
        this.$message.success(`delete ${data.name} success!`);
      },
      () => {}
    );
  }
  onEdit(data: any) {
    this.isVisible = true;
    this.editId = data._id;
    this.addForm.patchValue({ name: data.name });
    this.addForm.patchValue({ img_src: data.img_src });
    this.addForm.patchValue({ fps: data.fps });
    console.log(this.addForm);
  }
  toDetail(data: any) {
    this.router.navigate(['/layout/music-details'], {
      queryParams: {
        name: data.name,
        albumPicUrl: data.img_src,
        albumName: JSON.stringify(data.fps),
      },
    });
  }

  getMusicList() {
    let params = {
      page: this.page,
      size: this.size,
      search: this.search,
    };
    this.apiService.post('gameList', params).subscribe(
      (res: any) => {
        this.loading = false;
        const { code, data, total } = res;
        if (code == 0) {
          this.musicList = data;
          this.musicList.forEach((item: any, index: number) => {
            item.names = item.name.split('\r\n');
            item.idx = index;
          });
          this.total = total;
          console.log('this.musicList', this.musicList);
        } else {
          this.musicList = [];
        }
      },
      () => {
        this.loading = false;
      }
    );
  }
  pageChange(val: number) {
    this.page = val;
    console.log(val);
    this.getMusicList();
  }
  pageSizeChange(val: number) {
    this.size = val;
    this.getMusicList();
  }
}
