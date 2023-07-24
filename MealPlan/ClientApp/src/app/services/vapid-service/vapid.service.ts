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
    this.vapidKeyService.apiVapidPublicKeyGet().subscribe({
      next: key => {
        this.swPush.requestSubscription({serverPublicKey: key})
          .then(sub => {
            this.vapidSubscribeService.apiVapidSubscriptionPost(sub as SubscriptionDto).subscribe({
              next: () => {
                alert('Subscription successful');
              },
              error: (error) => {
                alert('Error subscribing:\n\n' + error);
              }
            });
          })
          .catch(err => {
            alert('Could not subscribe to notifications.\n\n' + err.message);
          });
      },

      error: error => {
        alert('Failed to get subscription key: ' + error);
      }
    });
  }
}
