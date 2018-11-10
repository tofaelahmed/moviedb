import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "../services/authentication/authentication.service";
import { User } from "../models/user";
import { SocketService } from "../services/socket/socket.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  currentUser$: Observable<User>;
  navbarOpen = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private socketService: SocketService
  ) {
    this.currentUser$ = this.authenticationService.currentUser.pipe(
      map(user => {
        if (user) {
          socketService.connect();
        }

        return user;
      })
    );
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }
}
