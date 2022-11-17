import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { StorageService } from './storage.service';
import { NavigateService } from './navigate.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EventService } from './event.service';
import apiMap from '../api.json';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  _baseUrl = "http://127.0.0.1:5000/"
  constructor(
    private storageService: StorageService,
    private httpClient: HttpClient,
    private translateService: TranslateService,
    private dialogService: NzMessageService,
    private navigateService: NavigateService,
  ) { }
  get(url: string, params: any) {
    return this.httpClient.get(this._baseUrl+url, params );
  }
  post(url: string, params: any){
    if(url=='login' || url =='register'){
      return this.httpClient.post(this._baseUrl+url, params);
    }
    return this.httpClient.post(this._baseUrl+url, params,{
      headers: new HttpHeaders().set('token', this.storageService.getItem('token'))})
  }
}
export function isNullOrUndefine(target): boolean {
  return target === null || typeof target === 'undefined';
}
