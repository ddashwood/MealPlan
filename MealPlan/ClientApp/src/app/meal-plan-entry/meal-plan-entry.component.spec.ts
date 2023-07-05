import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanEntryComponent } from './meal-plan-entry.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
