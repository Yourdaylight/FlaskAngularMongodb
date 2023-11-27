import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  _baseUrl = 'http://127.0.0.1:5000/api/v1';
  constructor(
    private httpClient: HttpClient,
    private dialogService: NzMessageService
  ) {}
  get(url: string, params: any) {
    return this.httpClient.get(this._baseUrl + url, params);
  }
  post(url: string, params: any) {
    if (url.indexOf('login') !== -1 || url.indexOf('register') !== -1) {
      return this.httpClient.post(this._baseUrl + url, params);
    }
    return this.httpClient.post(this._baseUrl + url, params, {
      headers: new HttpHeaders().set(
        'token',
        localStorage.getItem('token') as any
      ),
    });
  }
}
export function isNullOrUndefine(target: any): boolean {
  return target === null || typeof target === 'undefined';
}
