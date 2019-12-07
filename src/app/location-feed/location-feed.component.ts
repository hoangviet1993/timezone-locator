import { Component, OnInit} from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { UserLocation } from '../user-location.model';

@Component({
  selector: 'app-location-feed',
  templateUrl: './location-feed.component.html',
  styleUrls: ['./location-feed.component.scss']
})

export class LocationFeedComponent implements OnInit {
  private TIMEZONEDB_SUCCESS_STATUS = "OK";
  private TIMEZONEDB_FAIL_STATUS = "FAILED"; 
  private TIMEZONEDB_INVALID_LATITUDE_MESSAGE = "Invalid latitude value."
  private TIMEZONEDB_INVALID_LONGITUDE_MESSAGE = "Invalid longitude value."
  private TIMEZONEDB_NO_RECORD_MESSAGE = "Record not found."
  //References from https://timezonedb.com/references/get-time-zone

  coordinateForm: FormGroup;

  isClickable: boolean = true;
  isSuccessful: boolean = false;
  isInvalidCoordinate: boolean = false;
  isNoRecord: boolean = false;

  userTime: Date;
  userLongitude: number = 0;
  userLatitude: number = 0;
  userCity: string = '';
  userTimeZone: string = '';

  populateResult() {
    this.userLatitude = this.coordinateForm.controls['latitudeInput'].value;
    this.userLongitude = this.coordinateForm.controls['longitudeInput'].value;
    this.getUserLocation(this.userLatitude, this.userLongitude).subscribe(
      (response) => {
        if (response.status == this.TIMEZONEDB_SUCCESS_STATUS) {
          var currentLocation = response;
          this.userCity = currentLocation.countryName;
          this.userTimeZone = currentLocation.abbreviation;
          this.userTime = currentLocation.formatted;
          this.isSuccessful = true;
        }
        else if (response.status == this.TIMEZONEDB_FAIL_STATUS) {
          if (response.message == this.TIMEZONEDB_INVALID_LATITUDE_MESSAGE ||
            response.message == this.TIMEZONEDB_INVALID_LONGITUDE_MESSAGE) {
            this.isInvalidCoordinate = true;
          }
          else if (response.message == this.TIMEZONEDB_NO_RECORD_MESSAGE) {
            this.isNoRecord = true;
          }
        }
      }
    );
  }

  onClick() {
    if (this.coordinateForm.invalid) {
      return;
    }
    this.isClickable = false;
    this.isSuccessful = false;
    this.isInvalidCoordinate = false;
    this.isNoRecord = false;
    this.populateResult();
    setTimeout(()=>{
      this.isClickable = true;
    }, 1500);
    // TimezoneDB enforce a rate limit of 1 query/s.
  }

  constructor(private http: HttpClient, private formbuilder: FormBuilder) {}

  ngOnInit() {
    this.coordinateForm = this.formbuilder.group({
      latitudeInput: ['', [
        Validators.required, Validators.min(-90), Validators.max(90)]],
      longitudeInput: ['', [
        Validators.required, Validators.min(-180), Validators.max(180)]]
    });
  }

  getUserLocation(latitude: number, longitude:number): Observable<UserLocation>
  {
    let TIMEZONEDB_API_KEY = "YOUR_API_HERE";
    let timezoneDBUrl = "https://api.timezonedb.com/v2.1/get-time-zone?key="
      + TIMEZONEDB_API_KEY + "&format=json&by=position&lat=" + latitude + 
      "&lng=" + longitude;
    return this.http.get<UserLocation>(timezoneDBUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // TODO: Need to log error with a back-end here
    return throwError(errorMessage);
  }
  // Code snippet taken from 
  // https://scotch.io/bar-talk/error-handling-with-angular-6-tips-and-best-practices192
}
