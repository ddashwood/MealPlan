import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { ViewerRouteGuard } from './authorisation/viewer-route-guard';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'mealplan', component: MealPlanComponent, canActivate: [ViewerRouteGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent}  
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
