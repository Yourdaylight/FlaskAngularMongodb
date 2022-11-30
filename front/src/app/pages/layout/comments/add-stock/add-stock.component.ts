import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService} from 'src/app/services/api.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.less']
})
export class AddStockComponent implements OnInit {
  userForm:FormGroup ;
  constructor(
    private fb: FormBuilder,
    private nzModalService: NzModalService,
    private apiService: ApiService,
    private storageService: StorageService,
    private modalRef: NzModalRef,
    private $message: NzMessageService,
    private navigateService: NavigateService
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      stock: ['', [Validators.required]],
    });
  }
  submitUser(){
    this.userForm.markAllAsTouched();
    if (!this.userForm.valid) {return}
    let params = this.userForm.value;
    params['username'] = this.storageService.getItem('username');
    this.apiService.post( 'addStock', params ).subscribe((res: any) => {
      console.log(res);
      const { code, msg } = res;
      if (code === 0) {
        this.$message.success('Add Succeed！')
        this.modalRef.destroy('success')
      } else {
       this.$message.error(msg)
      }
    });
  }

}
