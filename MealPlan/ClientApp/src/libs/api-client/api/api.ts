export * from './identity.service';
import { IdentityService } from './identity.service';
export * from './weatherForecast.service';
import { WeatherForecastService } from './weatherForecast.service';
export const APIS = [IdentityService, WeatherForecastService];
