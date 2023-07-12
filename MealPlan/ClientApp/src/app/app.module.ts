import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpRequest } from '@angular/common/http';
import { NgHttpCachingModule } from 'ng-http-caching';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { Configuration, ConfigurationParameters } from 'src/libs/api-client';
import { LoginComponent } from './login/login.component';
import { JWTTokenService } from './services/jwt-token-service/jwttoken.service';
import { UnauthorisedInterceptor } from './authorisation/unauthorised-interceptor';
import { ViewerRouteGuard } from './authorisation/viewer-route-guard';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MealPlanEntryComponent } from './meal-plan-entry/meal-plan-entry.component';
import { MealPlanEntryEditorComponent } from './meal-plan-entry-editor/meal-plan-entry-editor.component';
import { ngHttpCachingConfig } from './caching-config';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { apiConfigFactory } from './openapi-helpers';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    MealPlanComponent,
    MealPlanEntryComponent,
    MealPlanEntryEditorComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    InfiniteScrollModule,
    NgHttpCachingModule.forRoot(ngHttpCachingConfig),
    ReactiveFormsModule,
    RxReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: Configuration,
      useFactory: (authService: JWTTokenService) => apiConfigFactory(authService),
      deps: [JWTTokenService],
      multi: false
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorisedInterceptor,
      multi: true
    },
    ViewerRouteGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
