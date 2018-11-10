import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "../authentication/authentication.service";
import { Observable } from "rxjs";
import { Movie } from "src/app/models/movie";
import { events } from "src/app/utils";

@Injectable({
  providedIn: "root"
})
export class SocketService {
  private socket;

  constructor(private authenicationService: AuthenticationService) {}

  connect() {
    this.socket = io(environment.socketUrl, {
      query: {
        token: this.authenicationService.currentUserValue.token
      }
    });
  }

  subscribeMovieEvents() {
    return Observable.create(observer => {
      this.socket.on(events.MOVIE_ADDED, (movie: Movie) => {
        const data = {
          event: events.MOVIE_ADDED,
          data: movie
        };
        observer.next(data);
      });
      this.socket.on(events.MOVIE_UPDATED, (movie: Movie) => {
        const data = {
          event: events.MOVIE_UPDATED,
          data: movie
        };
        observer.next(data);
      });
      this.socket.on(events.MOVIE_DELETED, (movieId: string) => {
        const data = {
          event: events.MOVIE_DELETED,
          data: {
            id: movieId
          }
        };
        observer.next(data);
      });
    });
  }
}
