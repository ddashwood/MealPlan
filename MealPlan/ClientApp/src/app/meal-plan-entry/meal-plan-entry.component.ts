import { Component, Input } from '@angular/core';
import { MealPlanDto } from 'src/libs/api-client';

@Component({
  selector: 'app-meal-plan-entry',
  templateUrl: './meal-plan-entry.component.html',
  styleUrls: ['./meal-plan-entry.component.css']
})
export class MealPlanEntryComponent {
  @Input() entry!: MealPlanDto;
}
