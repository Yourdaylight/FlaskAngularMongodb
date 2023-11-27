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
  movieList: any = [];
  loading: boolean = true;
  isVisible: boolean = false;
  addForm!: FormGroup;
  addField: any = [
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
    }
  ];
  page: number = 1;
  size: number = 18;
  total: number = 10;
  searchForm!: FormGroup;
  searchField: any = [
    {
      label: 'Title',
      value: 'Title',
    },
    {
      label: 'Developer',
      value: 'Developer',
    },
  ];
  typeOption: any = [
    {
      label: 'Movie',
      value: 'Movie',
    },
    {
      label: 'TV Show',
      value: 'TV Show',
    },
    {
      label: 'all',
      value: 'all',
    },
  ];

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
      Title: [null, [Validators.required]],
      'Original Price': [null, [Validators.required]],
      'Discounted Price': [null, [Validators.required]],
      Developer: [null, [Validators.required]],
      Publisher: [null, [Validators.required]],
      'Release Date': [null, [Validators.required]],
      'Game Description': [null, [Validators.required]],
    });
    this.searchForm = this.fb.group({
      title: [null],
      director: [null],
      country: [null],
      type: ["all", [Validators.required]],
    });
    this.getMovieList();
  }

  submitForm(): void {
    if (this.addForm.valid) {
      let params = { ...this.addForm.value };
      this.apiService.post('/game/addGame', params).subscribe(
        (res: any) => {
          this.isVisible = false;
          this.getMovieList();
          this.$message.success(`add success!`);
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
    this.size = 18;
    this.getMovieList();
  }
  toDetail(data: any) {
    localStorage.setItem('movieInfo', JSON.stringify(data));
    this.router.navigate(['/layout/movie-details']);
  }

  getMovieList() {
    let search = '';
    console.log(this.searchForm.value);
    if (this.searchForm.value)
      Object.entries(this.searchForm.value).forEach(([key, val]: any) => {

        if (val && key!="type") search = search + val;
      });
    console.log(search);
    let params = {
      page: this.page,
      size: this.size,
      search: search ? search : '',
      type: this.searchForm.value.type ==null ? 'all' : this.searchForm.value.type,
    };

    this.apiService.post('/game/getGames', params).subscribe(
      (res: any) => {
        this.loading = false;
        const { code, data, total } = res;
        if (code == 200) {
          this.loading = false;
          this.movieList = data;
          this.movieList.forEach((item: any, index: number) => {
            item.idx = index;
          });
          this.total = total;
          console.log('this.movieList', this.movieList);
        } else {
          this.movieList = [];
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
    this.getMovieList();
  }
  pageSizeChange(val: number) {
    this.size = val;
    this.getMovieList();
  }
}
