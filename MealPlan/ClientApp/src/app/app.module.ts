import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { ApiModule, Configuration, ConfigurationParameters } from 'src/libs/api-client';
import { getBaseUrl } from 'src/main';
import { LoginComponent } from './login/login.component';

function getOpenApiBaseUrl() : string {
  let url = getBaseUrl();
  if (url.endsWith("/")) {
    // Open API needs the trailing / removed
    url = url.slice(0, -1);
  }

  return url;
}

export function apiConfigFactory (): Configuration {
  const params: ConfigurationParameters = {
    basePath: getOpenApiBaseUrl()
  };
  let credentials: {[ key: string ]: string | (() => string | undefined)} = { };
  credentials["Bearer"] = () => "Bearer " + credentials["Token"];
  params.credentials = credentials;
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    LoginComponent
  ],
  imports: [
    ApiModule.forRoot(apiConfigFactory),
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'login', component: LoginComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
