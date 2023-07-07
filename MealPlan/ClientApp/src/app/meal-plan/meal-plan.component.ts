import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { MealPlanDto, MealPlanService } from 'src/libs/api-client';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.css']
})
export class MealPlanComponent implements OnInit {
  mealPlanEntries!: MealPlanDto[];
  editingEntry?: MealPlanDto;
  private startDate: Date;
  private endDate: Date;
  private modal: Modal = null!;

  constructor (private mealPlanService : MealPlanService) {
    this.startDate = new Date();
    this.endDate = this.addDays(this.startDate, 60);
  }

  ngOnInit(): void {
    this.mealPlanService.apiMealPlanGet(this.dateToString(this.startDate), this.dateToString(this.endDate))
        .subscribe(data => this.mealPlanEntries = data);
  }

  private addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private dateToString(date: Date) : string {
    return date.toISOString().split('T')[0];
  }

  public onScroll() {
    let newStartDate = this.addDays(this.endDate, 1);
    this.endDate = this.addDays(this.endDate, 7);

    console.log(`Scrolling from ${newStartDate} to ${this.endDate}`);

    this.mealPlanService.apiMealPlanGet(this.dateToString(newStartDate), this.dateToString(this.endDate))
        .subscribe(data => this.mealPlanEntries.push(...data));
  }

  public onSelectEntry(entry: MealPlanDto) {
    this.editingEntry = entry;
    this.modal = new Modal('#editor-modal');
    this.modal.show();
  }

  public onCloseEditor() {
    this.editingEntry = undefined;
    this.modal.hide();
  }
}
