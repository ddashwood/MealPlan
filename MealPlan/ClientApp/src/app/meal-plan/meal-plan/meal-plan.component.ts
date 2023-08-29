import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { MealPlanDto, MealPlanUpdateDto } from 'src/libs/api-client';
import { MealPlanEntryEditorComponent } from '../meal-plan-entry-editor/meal-plan-entry-editor.component';
import { JWTTokenService } from '../../services/jwt-token-service/jwttoken.service';
import { MealPlanService } from 'src/app/services/meal-plan-service/meal-plan.service';

@Component({
  selector: 'meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.css']
})
export class MealPlanComponent {
  editingEntry?: MealPlanDto;

  private _modal: Modal = null!;
  private _scrolling: boolean = false;

  @ViewChild(MealPlanEntryEditorComponent) editor:MealPlanEntryEditorComponent = null!;

  constructor (public mealPlanService : MealPlanService, private tokenService: JWTTokenService) { }

  public onScroll() {
    if(this._scrolling) {
      return; // Don't scroll again if we're already scrolling
    }

    try
    {
      this._scrolling = true;
      this.mealPlanService.getMoreData();
    }
    finally
    {
      this._scrolling = false;
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
    this._modal = new Modal('#editor-modal');
    this._modal.show();
  }

  public onCloseEditor() {
    this._modal.hide();
  }

  public onSave(saveData: MealPlanUpdateDto) {
    this.mealPlanService.save(saveData);
  }
}
