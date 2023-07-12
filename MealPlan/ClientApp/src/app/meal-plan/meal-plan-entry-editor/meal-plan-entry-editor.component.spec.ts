import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanEntryEditorComponent } from './meal-plan-entry-editor.component';

describe('MealPlanEntryEditorComponent', () => {
  let component: MealPlanEntryEditorComponent;
  let fixture: ComponentFixture<MealPlanEntryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealPlanEntryEditorComponent ]
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
