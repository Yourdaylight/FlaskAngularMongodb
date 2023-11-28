import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigateService } from 'src/app/services/navigate.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Main component for listing items
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  itemList: any = []; // Stores the list of items (games, TV shows, etc.)
  isLoading: boolean = true; // Indicates if data is being loaded
  isModalVisible: boolean = false; // Controls visibility of modal
  createForm!: FormGroup; // Form for adding new items
  createFormFields: any = [
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
  currentPage: number = 1; // Current page number for pagination
  pageSize: number = 18; // Number of items per page
  totalItems: number = 10; // Total number of items available
  searchQueryForm!: FormGroup; // Form for searching items
  searchQueryFields: any = [
    {
      label: 'Title',
      value: 'Title',
    },
    {
      label: 'Developer',
      value: 'Developer',
    },
  ];
  categoryOptions: any = [
    {
      label: 'Game',
      value: 'Game',
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

  // Constructor with necessary service injections
  constructor(
    private apiService: ApiService,
    private messageService: NzMessageService,
    private navigateService: NavigateService,
    public router: Router,
    private modalService: NzModalService,
    private formBuilder: FormBuilder
  ) {}

  // OnInit lifecycle hook to initialize forms and fetch initial data
  ngOnInit() {
    this.initializeCreateForm();
    this.initializeSearchForm();
    this.getGameList();
  }

  // Initialize the form for creating new items
  initializeCreateForm() {
    this.createForm = this.formBuilder.group({
      // Form controls with validators
      Title: [null, [Validators.required]],
      'Original Price': [null, [Validators.required]],
      'Discounted Price': [null, [Validators.required]],
      Developer: [null, [Validators.required]],
      Publisher: [null, [Validators.required]],
      'Release Date': [null, [Validators.required]],
      'Game Description': [null, [Validators.required]],
    });
  }

  // Initialize the search form
  initializeSearchForm() {
    this.searchQueryForm = this.formBuilder.group({
      // Form controls for search
      title: [null],
      director: [null],
      country: [null],
      type: ['all', [Validators.required]],
    });
  }

  // Submit the create form
  submitForm(): void {
    if (this.createForm.valid) {
      let params = { ...this.createForm.value };
      this.apiService.post('/game/addGame', params).subscribe(
        (res: any) => {
          this.isModalVisible = false;
          this.getGameList();
          this.messageService.success(`add success!`);
        },
        () => {
          // Error handling
        }
      );
    } else {
      // Handling form validation
      Object.values(this.createForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // Trigger search
  onSearch() {
    this.currentPage = 1;
    this.pageSize = 18;
    this.getGameList();
  }

  // Navigate to the detail page of an item
  toDetail(data: any) {
    localStorage.setItem('gameInfo', JSON.stringify(data));
    this.router.navigate(['/layout/game-details']);
  }

  // Fetch the list of items
  getGameList() {
    let search = '';
    if (this.searchQueryForm.value)
      Object.entries(this.searchQueryForm.value).forEach(([key, val]: any) => {
        if (val && key != 'type') search = search + val;
      });

    let params = {
      page: this.currentPage,
      size: this.pageSize,
      search: search ? search : '',
      type: this.searchQueryForm.value.type || 'all',
    };

    this.apiService.post('/game/getGames', params).subscribe(
      (res: any) => {
        this.isLoading = false;
        const { code, data, total } = res;
        if (code == 200) {
          this.isLoading = false;
          this.itemList = data;
          this.itemList.forEach((item: any, index: number) => {
            item.idx = index;
          });
          this.totalItems = total;
        } else {
          this.itemList = [];
        }
      },
      () => {
        this.isLoading = false;
        // Error handling
      }
    );
  }

  // Handle page change in pagination
  pageChange(val: number) {
    this.currentPage = val;
    this.getGameList();
  }

  // Handle page size change in pagination
  pageSizeChange(val: number) {
    this.pageSize = val;
    this.getGameList();
  }
}
