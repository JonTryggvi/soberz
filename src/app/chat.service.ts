import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { DataService } from './data.service';
import { UsersActions } from './users.actions';
// const CHAT_URL = 'ws://echo.websocket.org/';

// export interface Message {
//   author: string,
//   message: string
// }

@Injectable()
export class ChatService {
  private url =  this.dataService.serverPath + this.dataService.chatPort;
  private socket;    
  // public messages: Subject<Message>;
  constructor(private dataService: DataService, private usersActions: UsersActions) {
    this.socket = io(this.url);
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

  killConnection = (sockedId) => {
    return Observable.create((observer) => {
      this.socket.on('kill socket', (socketId) => {
        observer.next(socketId)
      })
    })
  }
}