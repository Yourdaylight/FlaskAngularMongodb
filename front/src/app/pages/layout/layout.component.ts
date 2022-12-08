import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  username: any = '';
  constructor() {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }
}
