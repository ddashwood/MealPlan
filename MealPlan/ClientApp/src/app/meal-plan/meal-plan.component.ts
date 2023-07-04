import { Component, OnInit } from '@angular/core';
import { MealPlanService } from 'src/libs/api-client';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.css']
})
export class MealPlanComponent implements OnInit {
  constructor (private mealPlanService : MealPlanService) {
  }
  ngOnInit(): void {
    var today = new Date();
    var end = this.addDays(today, 7); // Start off with 1 week's data
    this.mealPlanService.apiMealPlanGet(this.dateToString(today), this.dateToString(end)).subscribe(() => {});
  }

  private addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private dateToString(date: Date) : string {
    return date.toISOString().split('T')[0];
  }
}
