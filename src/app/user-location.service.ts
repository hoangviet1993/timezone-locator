import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { UserLocation } from './user-location.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserLocationService {

  constructor(private http: HttpClient) { }

  public getUserLocation(
    latitude: number, longitude: number): Observable<UserLocation> {
    const timezoneDBUrl = this.generateTimezoneDBUrl(latitude, longitude);
    return this.http.get<UserLocation>(timezoneDBUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  private handleError(error) {
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


  public generateTimezoneDBUrl(latitude: number, longitude: number): string {
    if (latitude && longitude) {
      const timezoneDBUrl = environment.TIMEZONEDB_GET_TIME_ZONE_URL
        + '&lat=' + latitude + '&lng=' + longitude;
      return timezoneDBUrl;
    }
    return null;
  }
}
