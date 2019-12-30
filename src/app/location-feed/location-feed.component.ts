import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { UserLocationService } from '../user-location.service';
import { ConvertStringToDateObjectPipe
} from '../convert-string-to-date-object.pipe';

@Component({
  selector: 'app-location-feed',
  templateUrl: './location-feed.component.html',
  styleUrls: ['./location-feed.component.scss'],
  providers: [ConvertStringToDateObjectPipe, UserLocationService]
})

export class LocationFeedComponent implements OnInit {
  private TIMEZONEDB_SUCCESS_STATUS = 'OK';
  private TIMEZONEDB_FAIL_STATUS = 'FAILED';
  private TIMEZONEDB_INVALID_LATITUDE_MESSAGE = 'Invalid latitude value.';
  private TIMEZONEDB_INVALID_LONGITUDE_MESSAGE = 'Invalid longitude value.';
  private TIMEZONEDB_NO_RECORD_MESSAGE = 'Record not found.';
  // References from https://timezonedb.com/references/get-time-zone

  coordinateForm: FormGroup;

  isClickable = true;
  isSuccessful = false;
  isInvalidCoordinate = false;
  isNoRecord = false;

  userTime: Date;
  userLongitude = 0;
  userLatitude = 0;
  userCity = '';
  userTimeZone = '';
  userGMTOffset = '';

  populateResult() {
    this.userLatitude = this.coordinateForm.controls[`latitudeInput`].value;
    this.userLongitude = this.coordinateForm.controls[`longitudeInput`].value;
    this.locationService.getUserLocation(
      this.userLatitude, this.userLongitude).subscribe(
      (response) => {
        if (response.status === this.TIMEZONEDB_SUCCESS_STATUS) {
          const currentLocation = response;
          this.userCity = currentLocation.countryName;
          this.userTimeZone = currentLocation.abbreviation;
          this.userTime = this.datePipe.transform(currentLocation.formatted);
          this.userGMTOffset = this.calculateGMTTimezone(
            currentLocation.gmtOffset);
          this.isSuccessful = true;
          setInterval(() => {
            this.userTime.setSeconds(this.userTime.getSeconds() + 1);
            this.userTime = new Date(this.userTime);
          }, 1000);
        } else if (response.status === this.TIMEZONEDB_FAIL_STATUS) {
          if (response.message === this.TIMEZONEDB_INVALID_LATITUDE_MESSAGE ||
            response.message === this.TIMEZONEDB_INVALID_LONGITUDE_MESSAGE) {
            this.isInvalidCoordinate = true;
          } else if (response.message === this.TIMEZONEDB_NO_RECORD_MESSAGE) {
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
    setTimeout(() => {
      this.isClickable = true;
    }, 1500);
    // TimezoneDB enforce a rate limit of 1 query/s.
  }

  constructor(
    private formbuilder: FormBuilder,
    private datePipe: ConvertStringToDateObjectPipe,
    private locationService: UserLocationService
  ) {}

  ngOnInit() {
    this.coordinateForm = this.formbuilder.group({
      latitudeInput: ['', [
        Validators.required, Validators.min(-90), Validators.max(90)]],
      longitudeInput: ['', [
        Validators.required, Validators.min(-180), Validators.max(180)]]
    });
  }

  private calculateGMTTimezone(offset: number): string {
    let GMTTimezone = '';
    if (offset) {
      const gmtOffsetValue = offset / 3600;
      if (gmtOffsetValue > 0) {
        GMTTimezone = '(GMT+' + gmtOffsetValue.toString() + ')';
      } else if (gmtOffsetValue < 0) {
        GMTTimezone = '(GMT' + gmtOffsetValue.toString() + ')';
      } else if (gmtOffsetValue === 0) {
        GMTTimezone = '(GMT0)';
      }
    }
    return GMTTimezone;
  }
}
