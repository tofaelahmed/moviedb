import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { MessageService } from "../../services/message/message.service";
import { UserService } from "../../services/user/user.service";
import { AuthenticationService } from "../../services/authentication/authentication.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  get formControls() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService
      .signup(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.messageService.success(
            "Registration successful, please login.",
            true
          );
          this.router.navigate(["/login"]);
        },
        error => {
          this.messageService.error(error);
          this.loading = false;
        }
      );
  }
}
