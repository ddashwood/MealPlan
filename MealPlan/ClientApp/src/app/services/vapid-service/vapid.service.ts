import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { SubscriptionDto, VapidPublicKeyService, VapidSubscriptionService } from 'src/libs/api-client';

@Injectable({
  providedIn: 'root'
})
export class VapidService {

  constructor(private vapidKeyService: VapidPublicKeyService, private vapidSubscribeService: VapidSubscriptionService, private swPush: SwPush)
  { }

  public subscribe() : void {
    this.vapidKeyService.apiVapidPublicKeyGet().subscribe(
      key => {
        this.swPush.requestSubscription({serverPublicKey: key})
          .then(sub => {
            this.vapidSubscribeService.apiVapidSubscriptionPost(sub as SubscriptionDto).subscribe(() => {});
          })
          .catch(err => {
            console.error('Could not subscribe to notifications', err)
          });
      }
    )
  }
}
