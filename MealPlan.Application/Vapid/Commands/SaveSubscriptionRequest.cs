using MealPlan.Models.Vapid;
using MediatR;

namespace MealPlan.Application.Vapid.Commands;

public class SaveSubscriptionRequest: IRequest
{
    public VapidSubscription Subscription { get; }

    public SaveSubscriptionRequest(VapidSubscription subscription)
    {
        Subscription = subscription;
    }
}
