import { Directive, EventEmitter, HostListener, OnInit, Output, OnDestroy, Input, ElementRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[debounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 500; // 默认1秒
  @Output() debounceClick = new EventEmitter();
  private clicks = new Subject<any>();
  private subscription: Subscription;
  constructor(private el: ElementRef) {
    // el.nativeElement.style.backgroundColor = 'yellow';
 }
  ngOnInit() {
    this.subscription = this.clicks
      .pipe(debounceTime(this.debounceTime)) // 防抖
      .subscribe(e => this.debounceClick.emit(e)); // 发射事件
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // 勾销订阅
  }
  @HostListener('click', ['$event']) 
  clickEvent(event: MouseEvent) {
    // 阻止浏览器的默认行为和事件冒泡
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event); // 此处产生流
  }
}
