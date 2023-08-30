import { Component, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { MealPlanDto, MealPlanUpdateDto } from 'src/libs/api-client';
import { MealPlanEntryEditorComponent } from '../meal-plan-entry-editor/meal-plan-entry-editor.component';
import { JWTTokenService } from '../../services/jwt-token-service/jwttoken.service';
import { MealPlanService } from 'src/app/services/meal-plan-service/meal-plan.service';
import { MealPlanListDatasource } from './meal-plan-list-datasource';
import { Observable } from 'rxjs';

@Component({
  selector: 'meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.css'],
  // every instance of this component will get its own instance of the MealPlanListDatasource
  providers: [MealPlanListDatasource]
})
export class MealPlanComponent implements OnInit {
  entries$: Observable<MealPlanDto[]>;
  editingEntry?: MealPlanDto;

  private _modal: Modal = null!;

  @ViewChild(MealPlanEntryEditorComponent) editor: MealPlanEntryEditorComponent = null!;

  constructor(
    private mealPlanService: MealPlanService,
    private mealPlanListDatasource: MealPlanListDatasource,
    private tokenService: JWTTokenService,
  ) {
    this.entries$ = this.mealPlanListDatasource.data$;
  }

  ngOnInit() {
    // Can use the refresh as an Init.
    this.mealPlanListDatasource.refresh();
  }

  public onScroll() {
    // The exhaustMap in this function will handle ignoring too many scroll events for us.
    this.mealPlanListDatasource.fetchNextPage();
  }

  public canEdit(): boolean {
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

  public onRefresh() {
    this.mealPlanListDatasource.refresh();
  }

  public onCloseEditor() {
    this._modal.hide();
  }

  public onSave(saveData: MealPlanUpdateDto) {
    // MealPlanService doesn't do much anymore. I'm on the fence about whether this should go somewhere else.
    // It might make sense to make the list datasource responsible for calling a save API also.
    this.mealPlanService.save(saveData).subscribe(entry => this.mealPlanListDatasource.updateItem(entry));
  }
}
