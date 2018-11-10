import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../services/message/message.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"]
})
export class MessagesComponent implements OnInit {
  private subscription: Subscription;
  message: any;

  constructor(public messageService: MessageService) {}

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.message = message;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
