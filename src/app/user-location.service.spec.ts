import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserLocationService } from './user-location.service';
import { UserLocation } from './user-location.model';

describe('UserLocationService', () => {
  let userLocationServiceUnderTest: UserLocationService;
  let http: HttpTestingController;
  const validUserLocation =
    {
      abbreviation: 'KGT',
      countryName: 'Kyrgyzstan',
      formatted: '2019-12-11 02:48:05',
      gmtOffset: 21600,
      status: 'OK',
      timestamp: 1576032485,
      message: 'string',
      zoneName: 'Asia/Bishkek'
    } as UserLocation;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserLocationService]
    });

    userLocationServiceUnderTest = TestBed.get(UserLocationService);
    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: UserLocationService = TestBed.get(UserLocationService);
    expect(service).toBeTruthy();
  });

  it('should return the user location given valid coordinates', () => {
    const latitude = 40;
    const longitude = 74;
    const timezoneDBUrl = userLocationServiceUnderTest.generateTimezoneDBUrl(
      latitude, longitude);
    userLocationServiceUnderTest.getUserLocation(
      latitude, longitude).subscribe(result => {
        expect(result).toEqual(validUserLocation);
    });

    const req = http.expectOne(timezoneDBUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(validUserLocation);
  });

  it('should return the user location after the request fails once', () => {
    const latitude = 40;
    const longitude = 74;
    let location: UserLocation;
    const timezoneDBUrl = userLocationServiceUnderTest.generateTimezoneDBUrl(
      latitude, longitude);
    userLocationServiceUnderTest.getUserLocation(
      latitude, longitude).subscribe(result => {
        location = result;
    });

    const firstRequest = http.expectOne(timezoneDBUrl, 'initial fail request');
    expect(firstRequest.request.method).toEqual('GET');
    firstRequest.flush(
      'ERROR', {status: 500, statusText: 'Internal server error'});

    const secondRequest = http.expectOne(timezoneDBUrl);
    expect(secondRequest.request.method).toEqual('GET');
    secondRequest.flush(validUserLocation);

    expect(location).toEqual(validUserLocation);
  });

  afterEach(() => {
    http.verify();
  });
});
