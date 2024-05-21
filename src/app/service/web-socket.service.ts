import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: Socket;

  webhookUrl = environment.webhookApi;

  constructor() {
    this.socket = io(this.webhookUrl); // Replace with your server's URL
  }

  // Emit a message to the server
  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  // Listen for events from the server
  listen(eventName: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(eventName, (data) => {
        observer.next(data);
      });
    });
  }
}
