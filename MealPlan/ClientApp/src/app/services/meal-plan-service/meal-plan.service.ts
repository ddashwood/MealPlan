import { Injectable } from '@angular/core';
import { MealPlanService as MealPlanHttpService, MealPlanDto, MealPlanUpdateDto } from 'src/libs/api-client';


@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  constructor(private http: MealPlanHttpService) {
    this._startDate = new Date();
    this._endDate = this.addDays(this._startDate, 60);

    this.http.apiMealPlanGet(this.dateToString(this._startDate), this.dateToString(this._endDate))
        .subscribe(data => this._mealPlanEntries = data);
  }

  private _startDate: Date;
  private _endDate: Date;

  private _mealPlanEntries: MealPlanDto[] = [];
  get mealPlanEntries() : MealPlanDto[] {
    return this._mealPlanEntries;
  }

  refresh() {
    this.http.apiMealPlanGet(this.dateToString(this._startDate), this.dateToString(this._endDate))
        .subscribe(data => this._mealPlanEntries = data);
  }

  public getMoreData() : void {
    let newStartDate = this.addDays(this._endDate, 1);
    this._endDate = this.addDays(this._endDate, 7);

    console.log(`Scrolling from ${newStartDate} to ${this._endDate}`);

    this.http.apiMealPlanGet(this.dateToString(newStartDate), this.dateToString(this._endDate))
        .subscribe(data => this._mealPlanEntries.push(...data));

  }

  public save(entry: MealPlanUpdateDto) : void {
    this.http.apiMealPlanPut(entry).subscribe(entry => {
      let existingIndex = this.mealPlanEntries.findIndex(e => e.date === entry.date);

      if (existingIndex === -1) {
        // Should probably try to insert at the correct position, but since this ought to
        // never happen, it can stay as it is for now
        this.mealPlanEntries.push(entry);
      } else {
        this.mealPlanEntries[existingIndex] = entry;
      }
    });
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
