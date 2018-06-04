import { Component, OnInit, Input } from '@angular/core';
import { sponseReqNotifications } from '../../../classes/notifycations';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  @Input() notifiers: sponseReqNotifications;
  constructor() { }

  ngOnInit() {
  }

}
