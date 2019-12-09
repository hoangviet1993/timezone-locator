import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule
} from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LocationFeedComponent } from './location-feed.component';
import { ConvertStringToDateObjectPipe } 
  from '../convert-string-to-date-object.pipe';

describe('LocationFeedComponent', () => {
  let component: LocationFeedComponent;
  let fixture: ComponentFixture<LocationFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        LocationFeedComponent,
        ConvertStringToDateObjectPipe,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
