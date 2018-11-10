import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./components/app.component";
import { ErrorInterceptor } from "./helpers/error.interceptor";

import { JwtInterceptor } from "./helpers/jwt.interceptor";
import { MessagesComponent } from "./components/messages/messages.component";
import { AppRoutingModule } from "./app-routing.module";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { AddEditMovieComponent } from "./components/add-edit-movie/add-edit-movie.component";
import { AgGridModule } from "ag-grid-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SocketService } from "./services/socket/socket.service";
import { ReviewComponent } from "./components/review/review.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    MessagesComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    AddEditMovieComponent,
    ReviewComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
