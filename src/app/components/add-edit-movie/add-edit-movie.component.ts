import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { MessageService } from "../../services/message/message.service";
import { MovieService } from "../../services/movie/movie.service";
import { Movie, Review } from "src/app/models/movie";
import { formatDate, events } from "src/app/utils";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-add-edit-movie",
  templateUrl: "./add-edit-movie.component.html",
  styleUrls: ["./add-edit-movie.component.css"]
})
export class AddEditMovieComponent implements OnInit {
  movieForm: FormGroup;
  loading = false;
  submitted = false;
  movieId: string;
  userReview: Review;
  movieDataFetched = false;
  showDelete = false;
  reviews = [];
  movieUpdates: Observable<Movie>;
  movieDeleted = false;
  averageRating = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private movieService: MovieService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.initializeForm();
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.movieId = id;
      this.loadMovieData(id);
    }
  }
  subscribeForUpdates() {
    this.movieUpdates = this.socketService
      .subscribeMovieEvents()
      .subscribe(updates => {
        this.setUpdatedData(updates.event, updates.data);
      });
  }
  initializeForm(
    id = "",
    title = "",
    releaseDate = "",
    duration = "",
    director = "",
    actors = ""
  ) {
    this.movieForm = this.formBuilder.group({
      id: [id],
      title: [title, Validators.required],
      releaseDate: [releaseDate, Validators.required],
      duration: [duration, Validators.required],
      director: [director, Validators.required],
      actors: [actors, Validators.required]
    });
  }

  loadMovieData(id) {
    this.movieService.getMovie(id).subscribe(data => {
      if (data) {
        this.setMovieDataToFrom(id, data);
        this.movieDataFetched = true;
        this.subscribeForUpdates();
      } else {
        this.messageService.error("This movie is not available anymore", false);
      }
    });
  }
  setMovieDataToFrom(id, data) {
    const {
      title,
      releaseDate,
      duration,
      director,
      actors,
      reviews,
      user,
      avgRating
    } = data;
    const date = formatDate(releaseDate);
    const loggedInUserId = this.authenticationService.currentUserValue.id;
    const userReview = reviews.find(review => review.user === loggedInUserId);
    this.showDelete = loggedInUserId === user;
    this.reviews = reviews;
    this.averageRating = avgRating;
    if (userReview) {
      this.userReview = userReview;
    }

    this.movieForm.setValue({
      id,
      title: title,
      releaseDate: date,
      duration: duration,
      director: director,
      actors: actors.toString()
    });
  }
  get f() {
    return this.movieForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.movieForm.invalid) {
      return;
    }
    const {
      id,
      title,
      releaseDate,
      duration,
      director,
      actors
    } = this.movieForm.value;
    const formattedActors = actors.split(",");
    const movie = {
      title,
      releaseDate,
      duration,
      director,
      actors: formattedActors
    };
    this.loading = true;
    if (id) {
      this.updateMovie(id, movie);
    } else {
      this.submitNewMovie(movie);
    }
  }

  submitNewMovie(movie: Movie) {
    this.movieService
      .addMovie(movie)
      .pipe(first())
      .subscribe(
        data => {
          this.messageService.success("New movie added successfully", true);
          this.router.navigate(["/dashboard"]);
        },
        error => {
          this.messageService.error(error);
          this.loading = false;
        }
      );
  }

  updateMovie(id: string, movie: Movie) {
    this.movieService
      .updateMovie(id, movie)
      .pipe(first())
      .subscribe(
        data => {
          this.messageService.success("Movie updated successfully", true);
          this.router.navigate(["/dashboard"]);
        },
        error => {
          this.messageService.error(error);
          this.loading = false;
        }
      );
  }

  deleteMovie(id) {
    this.movieService.deleteMovie(id).subscribe(
      data => {
        this.messageService.success("Movie deleted successfully", true);
        this.router.navigate(["/dashboard"]);
      },
      error => {
        this.messageService.error(error);
        this.loading = false;
      }
    );
  }

  setUpdatedData(event: string, movie: Movie) {
    switch (event) {
      case events.MOVIE_UPDATED:
        this.setMovieDataToFrom(this.movieId, movie);
        break;
      case events.MOVIE_DELETED:
        this.movieDeleted = true;
        this.messageService.error(
          "This movie has been deleted. Please go back to dashboard to see updated movie list.",
          false
        );

        break;
      default:
        console.log(`No handler for event ${event}`);
    }
  }
}
