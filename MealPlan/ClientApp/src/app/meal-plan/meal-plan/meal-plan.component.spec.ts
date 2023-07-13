import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanComponent } from './meal-plan.component';
import { MealPlanService } from 'src/libs/api-client';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

describe('MealPlanComponent', () => {
  let component: MealPlanComponent;
  let fixture: ComponentFixture<MealPlanComponent>;

  beforeEach(async () => {
    let mealServiceMock = jasmine.createSpyObj('MealPlanService', ['apiMealPlanGet', 'apiMealPlanPut']);
    mealServiceMock.apiMealPlanGet.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ 
        ReactiveFormsModule,
         InfiniteScrollModule
      ],
      declarations: [ MealPlanComponent ],
      providers: [
        { provide: MealPlanService, useValue: mealServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
