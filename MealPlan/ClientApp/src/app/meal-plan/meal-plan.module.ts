import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { MealPlanEntryComponent } from './meal-plan-entry/meal-plan-entry.component';
import { MealPlanEntryEditorComponent } from './meal-plan-entry-editor/meal-plan-entry-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MealPlanRoutingModule } from './meal-plan-routing.module';

@NgModule({
  declarations: [
    MealPlanComponent,
    MealPlanEntryComponent,
    MealPlanEntryEditorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MealPlanRoutingModule
  ]
})
export class MealPlanModule { }
