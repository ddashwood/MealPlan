import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { ViewerRouteGuard } from '../authorisation/viewer-route-guard';

const routes: Routes = [
  { path: 'mealplan', component: MealPlanComponent, canActivate: [ViewerRouteGuard] },
]


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MealPlanRoutingModule { }
