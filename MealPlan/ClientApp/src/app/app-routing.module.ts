import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { ViewerRouteGuard } from './authorisation/viewer-route-guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'mealplan', component: MealPlanComponent, canActivate: [ViewerRouteGuard] },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
