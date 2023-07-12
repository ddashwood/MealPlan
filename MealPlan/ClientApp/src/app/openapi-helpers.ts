import { Configuration, ConfigurationParameters } from 'src/libs/api-client';
import { getBaseUrl } from 'src/main';
import { JWTTokenService } from './services/jwt-token-service/jwttoken.service';

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