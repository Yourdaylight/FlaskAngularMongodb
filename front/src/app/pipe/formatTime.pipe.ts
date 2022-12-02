import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatTime' })
export class FormatTimePipe implements PipeTransform {
  //管道所要执行的事件  这个管道是身份证号的中间部分隐藏
  //例如{{Name | 管道}} value指的是Name值
  transform(value: number): any {
    //idCard 将你value传过来的值进行正则修改 之后再返回idCard
    var time;
    var hours = parseInt(
      (value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + ''
    );
    var minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60) + '');
    var seconds = Math.ceil((value % (1000 * 60)) / 1000);
    let hasHours = (hours < 10 ? '0' + hours : hours) + ':';
    time =
      (hours == 0 ? '' : hasHours) +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds);
    return time;
  }
}
