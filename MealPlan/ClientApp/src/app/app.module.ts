import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgHttpCachingModule } from 'ng-http-caching';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { Configuration } from 'src/libs/api-client';
import { JWTTokenService } from './services/jwt-token-service/jwttoken.service';
import { UnauthorisedInterceptor } from './authorisation/unauthorised-interceptor';
import { ViewerRouteGuard } from './authorisation/viewer-route-guard';
import { ngHttpCachingConfig } from './caching-config';
import { apiConfigFactory } from './openapi-helpers';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule} from '@angular/flex-layout'

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    NgHttpCachingModule.forRoot(ngHttpCachingConfig),
    AppRoutingModule,
    AuthenticationModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true, // !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),

    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule
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
