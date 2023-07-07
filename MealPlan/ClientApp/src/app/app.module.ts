import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpRequest } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgHttpCachingModule, NgHttpCachingConfig, NgHttpCachingStrategy } from 'ng-http-caching';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { Configuration, ConfigurationParameters } from 'src/libs/api-client';
import { getBaseUrl } from 'src/main';
import { LoginComponent } from './login/login.component';
import { JWTTokenService } from './services/jwt-token-service/jwttoken.service';
import { UnauthorisedInterceptor } from './authorisation/unauthorised-interceptor';
import { ViewerRouteGuard } from './authorisation/viewer-route-guard';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MealPlanEntryComponent } from './meal-plan-entry/meal-plan-entry.component';
import { MealPlanEntryEditorComponent } from './meal-plan-entry-editor/meal-plan-entry-editor.component';

const ngHttpCachingConfig: NgHttpCachingConfig = {
  lifetime: 1000 * 60, // cache expire after 60 seconds,
  allowedMethod: ['GET', 'HEAD'],
  cacheStrategy: NgHttpCachingStrategy.ALLOW_ALL,
  isCacheable: (req: HttpRequest<any>): boolean | undefined => {
    if(req.url.indexOf('/api/Location') !== -1 ) {
      return true;
    }
    if(req.url.indexOf('/api/Person') !== -1 ) {
      return true;
    }
    return false;
  }
};

function getOpenApiBaseUrl() : string {
  let url = getBaseUrl();
  if (url.endsWith("/")) {
    // Open API needs the trailing / removed
    url = url.slice(0, -1);
  }

  return url;
}

export function apiConfigFactory (authService: JWTTokenService): Configuration {
  const params: ConfigurationParameters = {
    basePath: getOpenApiBaseUrl(),
    credentials: {
      "Bearer": () => "Bearer " + authService.jwtToken
    }
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    MealPlanComponent,
    MealPlanEntryComponent,
    MealPlanEntryEditorComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'mealplan', component: MealPlanComponent, canActivate: [ViewerRouteGuard] },
      { path: 'login', component: LoginComponent },
    ]),
    InfiniteScrollModule,
    NgHttpCachingModule.forRoot(ngHttpCachingConfig),
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
