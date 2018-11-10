import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "../services/authentication/authentication.service";
import { User } from "../models/user";
import { SocketService } from "../services/socket/socket.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  currentUser: User;
  navbarOpen = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private socketService: SocketService
  ) {
    this.authenticationService.currentUser.subscribe(currentUser => {
      if (currentUser) {
        this.currentUser = currentUser;
        this.socketService.connect();
      }
    });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }
}
