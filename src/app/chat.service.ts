import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { DataService } from './data.service';
// const CHAT_URL = 'ws://echo.websocket.org/';

// export interface Message {
//   author: string,
//   message: string
// }

@Injectable()
export class ChatService {
  private url =  JSON.stringify(this.dataService.serverPath) +':3000';
  private socket;    

  // public messages: Subject<Message>;

  constructor(private dataService: DataService) {
    this.socket = io(this.url);
    // this.messages = <Subject<Message>>wsService
    //   .connect(CHAT_URL)
    //   .map((response: MessageEvent): Message => {
    //     let data = JSON.parse(response.data);
    //     return {
    //       author: data.author,
    //       message: data.message
    //     }
    //   });
  }
  public sendMessage(message) {
    this.socket.emit('new-message', message);
  }
  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }
  public sendStatus(isOnlineId) {
    this.socket.emit('userActive', isOnlineId);
  }
  getOnlineUsers = () => {
    return Observable.create((observer) => {
      this.socket.on('userActive', userActiveId => {
        observer.next(userActiveId);
      });
    });
  }

  userDisconnected = () => {
    return Observable.create((observer) => {
      this.socket.on('disconnected', sockedId => {
        observer.next(sockedId);
      });
    });
  }

}