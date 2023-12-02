import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ApiService} from 'src/app/services/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  employeeList: any[] = [];
  loading: boolean = true;
  isVisible: boolean = false;
  addForm!: FormGroup;
  searchForm!: FormGroup;
  page: number = 1;
  size: number = 18;
  total: number = 0;
  educationMapping: { [key: string]: string } = {
    '1': 'High School',
    '2': 'Associate Degree',
    '3': 'Bachelor\'s Degree',
    '4': 'Master\'s Degree',
  };

  jobLevelMapping: { [key: string]: string } = {
    '1': 'Entry Level',
    '2': 'Intermediate',
    '3': 'Senior',
    '4': 'Manager',
  };
  educationOptions: Array<{ label: string, value: number }> = [];
  jobLevelOptions: Array<{ label: string, value: number }> = [];

  genderMapping: { [key: string]: string } = {
    'Male': '👨',
    'Female': '👩'
  }
  genderOptions: Array<{ label: string, value: string }> = [
    {'label': '👨', 'value': 'Male'},
    {'label': '👩', 'value': 'Female'}
  ];
  attritionOptions: Array<{ label: string, value: string }> = [
    {'label': 'No', 'value': 'No'},
    {'label': 'Yes', 'value': 'Yes'}
  ];
  maritialOptions: Array<{ label: string, value: string }> = [
    {'label': 'Single', 'value': 'Single'},
    {'label': 'Married', 'value': 'Married'},
    {'label': 'Divorced', 'value': 'Divorced'},
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private messageService: NzMessageService
  ) {
  }

  ngOnInit(): void {
    // 转换映射为选项数组
    for (const key in this.educationMapping) {
      if (this.educationMapping.hasOwnProperty(key)) {
        // @ts-ignore
        this.educationOptions.push({label: this.educationMapping[key], value: key});
      }
    }
    for (const key in this.jobLevelMapping) {
      if (this.jobLevelMapping.hasOwnProperty(key)) {
        // @ts-ignore
        this.jobLevelOptions.push({label: this.jobLevelMapping[key], value: key});
      }
    }
    this.addForm = this.fb.group({
      Age: [null, Validators.required],
      Attrition: [this.attritionOptions[0].value, Validators.required],
      Department: [null, Validators.required],
      DistanceFromHome: [null, Validators.required],
      Education: [this.educationOptions[0].value, Validators.required],
      EducationField: [null, Validators.required],
      EmployeeName: [null, Validators.required],
      Gender: [this.genderOptions[0].value, Validators.required],
      JobLevel: [this.jobLevelOptions[0].value, Validators.required],
      JobRole: [null, Validators.required],
      MaritalStatus: [this.maritialOptions[0].value, Validators.required],
      MonthlyIncome: [null, Validators.required],
    });

    this.searchForm = this.fb.group({
      EmployeeName: [null],
      Department: [null],
      // 根据需要添加更多搜索条件字段...
    });
    this.getEmployeeList();
  }

  showAddEmployeeModal(): void {
    this.isVisible = true; // 设置模态框可见
  }

  deleteEmployee(employeeId: number): void {
    // 调用删除员工的 API
    this.apiService.post('delete', {EmployeeID: employeeId}).subscribe(
      (res: any) => {
        if (res.code === 200) {
          this.messageService.success('Employee deleted successfully');
          this.getEmployeeList(); // 重新获取员工列表
        } else {
          this.messageService.error('Failed to delete employee');
        }
      },
      error => {
        this.messageService.error('Error: ' + error.message);
      }
    );
  }

  getEmployeeList(): void {
    this.loading = true;
    const params = {
      page: this.page,
      size: this.size,
      EmployeeName: this.searchForm.value.EmployeeName || '',
    };
    this.apiService.post('list', params).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.code === 200) {
          this.employeeList = res.data;
          this.total = res.total;
        } else {
          this.messageService.error('Failed to fetch employee list');
        }
      },
      error => {
        this.loading = false;
        this.messageService.error('Error: ' + error.message);
      }
    );
  }

  submitForm(): void {
    if (this.addForm.valid) {
      const params = this.addForm.value;
      this.apiService.post('add', params).subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.isVisible = false;
            this.messageService.success('Employee added successfully');
            this.getEmployeeList(); // 重新获取员工列表
          } else {
            this.messageService.error('Failed to add employee');
          }
        },
        error => {
          this.messageService.error('Error: ' + error.message);
        }
      );
    } else {
      Object.values(this.addForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
  closeAddEmployeeModal(): void {
    this.isVisible = false;
  }
  // pageChange(val: number) {
  //   this.page = val;
  //   console.log(val);
  //   this.getMovieList();
  // }
  // pageSizeChange(val: number) {
  //   this.size = val;
  //   this.getMovieList();
  // }
}
