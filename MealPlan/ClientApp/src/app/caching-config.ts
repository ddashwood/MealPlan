import { HttpRequest } from "@angular/common/http";
import { NgHttpCachingConfig, NgHttpCachingStrategy } from "ng-http-caching";

let urlsToCache: string[] = [
    '/api/Location',
    '/api/Person'
];

export const ngHttpCachingConfig: NgHttpCachingConfig = {
    lifetime: 1000 * 60, // cache expire after 60 seconds,
    allowedMethod: ['GET', 'HEAD'],
    cacheStrategy: NgHttpCachingStrategy.ALLOW_ALL,
    isCacheable: (req: HttpRequest<any>): boolean | undefined => {
        for (let url of urlsToCache) {
            if (req.url.indexOf(url) !== -1) {
                return true;
            }
        }

        return false;
    }
};    