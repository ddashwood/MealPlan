import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanEntryComponent } from './meal-plan-entry.component';
import { MealPlanDto } from 'src/libs/api-client';

describe('MealPlanEntryComponent', () => {
  let component: MealPlanEntryComponent;
  let fixture: ComponentFixture<MealPlanEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealPlanEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealPlanEntryComponent);
    component = fixture.componentInstance;
    component.entry = <MealPlanDto> {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
