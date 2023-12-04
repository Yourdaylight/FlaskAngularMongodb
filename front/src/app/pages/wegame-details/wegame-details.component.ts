import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-wegame-details',
  templateUrl: './wegame-details.component.html',
  styleUrls: ['./wegame-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  movieInfo: any = {};
  fps: any = '';
  editForm!: FormGroup;
  editField: any = [
    {
      label: 'Name',
      value: 'Name',
    },
    {
      label: 'Distributor',
      value: 'Distributor',
    },
    {
      label: 'Developer',
      value: 'Developer',
    },
    {
      label: 'Release Date',
      value: 'Release Date',
    },
    {
      label: 'Summary',
      value: 'Summary',
    },
    {
      label: '# of Critic Reviews',
      value: '# of Critic Reviews',
    },
    {
      label: 'Critic Positive',
      value: 'Critic Positive',
    },
    {
      label: 'Critic Negative',
      value: 'Critic Negative',
    },
  ];
  isVisible: boolean = false;

  constructor(
    private apiService: ApiService,
    private $message: NzMessageService,
    public router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.movieInfo = JSON.parse(localStorage.getItem('movieInfo') as any);
    this.editForm = this.fb.group({
      Name: [null, [Validators.required]],
      Distributor: [null, [Validators.required]],
      Developer: [null, [Validators.required]],
      'Release Date': [null, [Validators.required]],
      Summary: [null, [Validators.required]],
      '# of Critic Reviews': [null, [Validators.required]],
      'Critic Positive': [null, [Validators.required]],
      'Critic Negative': [null, [Validators.required]],
    });
  }

  onDelete() {
    this.apiService.post('del_game', { _id: this.movieInfo._id }).subscribe(
      (res: any) => {
        this.$message.success(`Delete ${this.movieInfo.Name} Success!`);
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
      this.apiService.post('update_game', params).subscribe(
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
