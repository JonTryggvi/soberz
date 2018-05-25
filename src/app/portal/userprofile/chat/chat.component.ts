import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../../chat.service';
import { Message } from '../../../classes/message';
import { UserprofileComponent } from '../userprofile.component';
import * as moment from 'moment';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/filter';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  messageString = '';
  msgData: Message = {
    message: '',
    author: '',
    userId: null,
    timestamp: 0,
    class: ''
  };
  messages: Message[] = [];
  isLocal: boolean;
  constructor(private chatService: ChatService, private userProfile: UserprofileComponent) {}

  sendMessage() {
    this.msgData.message = this.messageString;
    this.msgData.author = this.userProfile.profileUser.firstname;
    this.msgData.userId = this.userProfile.profileUser.id;
    this.msgData.timestamp = Math.floor(Date.now());
    // console.log(this.msgData);
    this.chatService.sendMessage(this.msgData);
    this.messageString = '';
  }
  keyUp(event) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

  ngOnInit() {
    this.scrollToBottom();
    
    this.chatService
      .getMessages()
      .distinctUntilChanged()
      .filter((message: Message) => message.message.trim().length > 0)
      .throttleTime(1000)
      .subscribe((message: Message) => {
        console.log(message);
        this.isLocal = message.userId === this.userProfile.profileUser.id;
        message.class = this.isLocal ? 'localMsg' : 'foreignMsg';
        this.messages.push(message);
      });
    
    this.chatService.sendStatus(this.userProfile.profileUser.id);
  
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
