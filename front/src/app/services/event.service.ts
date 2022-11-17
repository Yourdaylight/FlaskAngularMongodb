import { Injectable} from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public ssidChangeEvent = 'ssid-change'

  event: EventEmitter;

  constructor() {
    this.event = new EventEmitter();
  }

  emit(eventKey: string, ...args: any[]) {
    this.event.emit(eventKey, args);
  }
  
  addListener(eventKey: string, handler: (...args: any[]) => void) {
    this.event.addListener(eventKey, handler);
  }
}
