import { Component, OnInit } from "@angular/core";

import { MovieService } from "../../services/movie/movie.service";
import { Router } from "@angular/router";
import { formatDate, events } from "src/app/utils";
import { SocketService } from "src/app/services/socket/socket.service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { Movie } from "src/app/models/movie";
import { Subscription, Observable } from "rxjs";
import { GridOptions } from "ag-grid-community";
import { CookieService } from "src/app/services/cookie/cookie.service";

const getDateTemplae = params => formatDate(params.data.releaseDate);
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  movies: Observable<Movie[]>;
  subscription: Subscription;
  gridOptions: GridOptions;
  movieUpdates;
  all = true;
  currentUserId: string;
  columnDefs = [
    {
      headerName: "Title",
      field: "title",
      cellClass: "cell-wrap-text",
      autoHeight: true,
      pinned: "left"
    },
    {
      headerName: "Release Date",
      field: "releaseDate",
      cellRenderer: getDateTemplae
    },
    { headerName: "Duration (in minutes)", field: "duration" },
    { headerName: "Director", field: "director" },
    { headerName: "Actors", field: "actors" },
    {
      headerName: "Average Rating (x/5)",
      field: "avgRating"
    }
  ];

  constructor(
    private movieService: MovieService,
    private router: Router,
    private socketService: SocketService,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.currentUserId = this.authenticationService.currentUserValue.id;
    this.movies = this.movieService.getMovies();
    this.movieUpdates = this.socketService.subscribeMovieEvents();
    this.initAgGrid();
  }

  initAgGrid() {
    this.gridOptions = <GridOptions>{
      enableColResize: true,
      pagination: true,
      columnDefs: this.columnDefs,
      enableCellChangeFlash: true,
      getRowNodeId: data => data.id,
      isExternalFilterPresent: () => true,
      doesExternalFilterPass: rowData => {
        if (!this.all) {
          return rowData.data.user === this.currentUserId;
        } else {
          return true;
        }
      },
      sortingOrder: ["asc", "desc"],
      onGridReady: params => {
        this.movies.subscribe(rowData => {
          if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(rowData);
            this.gridOptions.api.setSortModel(this.getSortPreference());
          }
          this.movieUpdates.subscribe(updates => {
            if (this.gridOptions.api) {
              this.updateData(updates.event, updates.data);
              this.gridOptions.api.resetRowHeights();
            }
          });

          window.addEventListener("resize", function() {
            setTimeout(function() {
              params.api.sizeColumnsToFit();
              params.api.resetRowHeights();
            });
          });
        });
      },

      onFirstDataRendered(params) {
        params.api.resetRowHeights();
      },
      onSortChanged: params => {
        this.setSortPreference(params.api.getSortModel());
      }
    };
  }
  goToMovieDetailPage(event) {
    this.router.navigateByUrl(`edit/${event.data.id}`);
  }

  updateData(event: string, movie: Movie) {
    switch (event) {
      case events.MOVIE_ADDED:
        this.gridOptions.api.updateRowData({
          add: [movie]
        });
        break;
      case events.MOVIE_UPDATED:
        console.log(movie);
        this.gridOptions.api.updateRowData({
          update: [movie]
        });
        break;
      case events.MOVIE_DELETED:
        this.gridOptions.api.updateRowData({
          remove: [movie]
        });
        break;
      default:
        console.log(`No handler for event ${event}`);
    }
  }

  externalFilterChanged(filter) {
    this.all = !this.all;
    this.gridOptions.api.onFilterChanged();
  }

  getSortPreference() {
    const savedPreference = this.cookieService.getCookie(`sortpref`);
    if (savedPreference) {
      return JSON.parse(savedPreference);
    } else {
      return [];
    }
  }

  setSortPreference(preference) {
    this.cookieService.setCookie(`sortpref`, JSON.stringify(preference), 6000);
  }
}
