import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { MessageService } from "../../services/message/message.service";
import { MovieService } from "src/app/services/movie/movie.service";

@Component({
  selector: "app-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.css"]
})
export class ReviewComponent implements OnInit {
  @Input() movieId;
  @Input() userReview;
  @Input() reviews;
  @Input() averageRating;
  reviewForm: FormGroup;
  loading = false;
  submitted = false;
  userReviewd = false;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.reviewForm = this.formBuilder.group({
      rating: ["", Validators.required],
      comment: ["", Validators.required]
    });
  }

  get formControls() {
    return this.reviewForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.reviewForm.invalid) {
      return;
    }

    this.loading = true;
    this.movieService
      .submitReview(this.movieId, this.reviewForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.userReviewd = true;
          this.loading = false;
          this.userReview = {
            rating: this.reviewForm.value.rating,
            comment: this.reviewForm.value.comment
          };
          this.messageService.success("Review added successfully.", false);
        },
        error => {
          this.messageService.error(error);
          this.loading = false;
        }
      );
  }
}
