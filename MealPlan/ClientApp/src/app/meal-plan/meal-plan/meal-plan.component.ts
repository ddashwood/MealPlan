import { Component, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { MealPlanDto, MealPlanService, MealPlanUpdateDto } from 'src/libs/api-client';
import { MealPlanEntryEditorComponent } from '../meal-plan-entry-editor/meal-plan-entry-editor.component';
import { JWTTokenService } from '../../services/jwt-token-service/jwttoken.service';

@Component({
  selector: 'meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.css']
})
export class MealPlanComponent implements OnInit {
  mealPlanEntries!: MealPlanDto[];
  editingEntry?: MealPlanDto;

  private startDate: Date;
  private endDate: Date;
  private modal: Modal = null!;
  private scrolling: boolean = false;

  @ViewChild(MealPlanEntryEditorComponent) editor:MealPlanEntryEditorComponent = null!;

  constructor (private mealPlanService : MealPlanService, private tokenService: JWTTokenService) {
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
    if(this.scrolling) {
      return; // Don't scroll again if we're already scrolling
    }

    try
    {
      this.scrolling = true;

      let newStartDate = this.addDays(this.endDate, 1);
      this.endDate = this.addDays(this.endDate, 7);

      console.log(`Scrolling from ${newStartDate} to ${this.endDate}`);

      this.mealPlanService.apiMealPlanGet(this.dateToString(newStartDate), this.dateToString(this.endDate))
          .subscribe(data => this.mealPlanEntries.push(...data));
    }
    finally
    {
      this.scrolling = false;
    }
  }

  public canEdit() : boolean {
    return this.tokenService.userCanEdit();
  }

  public onSelectEntry(entry: MealPlanDto) {
    if (!this.canEdit()) {
      return;
    }

    this.editingEntry = entry;
    this.editor.resetForm();
    this.modal = new Modal('#editor-modal');
    this.modal.show();
  }

  public onCloseEditor() {
    this.modal.hide();
  }

  public onSave(saveData: MealPlanUpdateDto) {
    this.mealPlanService.apiMealPlanPut(saveData).subscribe(entry => {
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
}
