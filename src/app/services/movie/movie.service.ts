import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Movie } from "../../models/movie";
import { MessageService } from "../message/message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: "root"
})
export class MovieService {
  constructor(private http: HttpClient) {}
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.apiUrl}/movies`);
  }

  getMovie(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${environment.apiUrl}/movies/${id}`);
  }

  addMovie(movie: Movie) {
    return this.http.post(`${environment.apiUrl}/movies`, movie);
  }

  updateMovie(id: string, movie: Movie) {
    return this.http.put(`${environment.apiUrl}/movies/${id}`, movie);
  }

  deleteMovie(id: string) {
    return this.http.delete(`${environment.apiUrl}/movies/${id}`, {
      responseType: "text"
    });
  }

  submitReview(id, review) {
    return this.http.put(`${environment.apiUrl}/movies/${id}/reviews`, review);
  }
}
