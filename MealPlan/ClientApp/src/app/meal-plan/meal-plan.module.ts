import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { ViewerRouteGuard } from '../authorisation/viewer-route-guard';
import { MealPlanEntryComponent } from './meal-plan-entry/meal-plan-entry.component';
import { MealPlanEntryEditorComponent } from './meal-plan-entry-editor/meal-plan-entry-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    MealPlanComponent,
    MealPlanEntryComponent,
    MealPlanEntryEditorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'mealplan', component: MealPlanComponent, canActivate: [ViewerRouteGuard] },
    ]),
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  exports: [
    RouterModule
  ]
})
export class MealPlanModule { }
