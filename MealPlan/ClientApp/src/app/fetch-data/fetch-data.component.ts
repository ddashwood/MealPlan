import { Component } from '@angular/core';
import { WeatherForecast, WeatherForecastService } from 'src/libs/api-client';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts: WeatherForecast[] = [];

  constructor(weatherService: WeatherForecastService) {
    weatherService.weatherforecastGet().subscribe(result => {
      this.forecasts = result;
    }, error => console.error(error));
  }
}

