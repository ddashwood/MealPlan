import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanEntryEditorComponent } from './meal-plan-entry-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationService, PersonService } from 'src/libs/api-client';
import { of } from 'rxjs';

describe('MealPlanEntryEditorComponent', () => {
  let component: MealPlanEntryEditorComponent;
  let fixture: ComponentFixture<MealPlanEntryEditorComponent>;

  beforeEach(async () => {
    let personMock = jasmine.createSpyObj('PersonService', ['apiPersonGet']);
    let locationMock = jasmine.createSpyObj('LocationService', ['apiLocationGet']);

    personMock.apiPersonGet.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ MealPlanEntryEditorComponent ],
      providers: [
        { provide: PersonService, useValue: personMock },
        { provide: LocationService, useValue: locationMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealPlanEntryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
