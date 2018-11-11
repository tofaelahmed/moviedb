import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthenticationService } from "../services/authentication/authentication.service";

const getErrorMessage = error => {
  if (error.data) {
    return error.data.message_en;
  } else if (error.errors) {
    return error.errors[Object.keys(error.errors)[0]].message;
  } else {
    return null;
  }
};
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          this.authenticationService.logout();
          if (!location.pathname.endsWith("/login")) location.reload(true);
        }
        const error =
          getErrorMessage(err.error) || err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
