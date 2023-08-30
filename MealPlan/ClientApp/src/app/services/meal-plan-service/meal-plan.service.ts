import { Injectable } from '@angular/core';
import { MealPlanService as MealPlanHttpService, MealPlanDto, MealPlanUpdateDto } from 'src/libs/api-client';


@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  constructor(private http: MealPlanHttpService) { }

  save(entry: MealPlanUpdateDto) {
    return this.http.apiMealPlanPut(entry);
  }
}
