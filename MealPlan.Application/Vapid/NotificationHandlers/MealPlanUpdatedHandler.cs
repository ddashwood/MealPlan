using MealPlan.Application.MealPlan.Notifications;
using MealPlan.Database.Contexts;
using MealPlan.Models.Configuration;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using PushnotificationsDemo.Models;
using WebPush;

namespace MealPlan.Application.Vapid.NotificationHandlers;

public class MealPlanUpdatedHandler : INotificationHandler<MealPlanUpdatedNotification>
{
    private readonly MealPlanContext _context;
    private readonly IConfiguration _configuration;

    public MealPlanUpdatedHandler(MealPlanContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task Handle(MealPlanUpdatedNotification notification, CancellationToken cancellationToken)
    {
        // To do - Add error handling, and tidy up
        // Exclude notifications from same user
        // See https://github.com/MicrosoftEdge/pushnotifications-demo-aspnetcore/blob/main/PushnotificationsDemo/Services/PushService.cs

        var client = new WebPushClient();
        foreach (var subscription in await _context.VapidSubscriptions.ToListAsync())
        {
            var vapidNotification = new NotificationContainer
            {
                Notification = new Notification
                {
                    Title = "Meal Plan updated",
                    Body = $"Meal plan for {notification.Date.ToString("MMMM dd")} has been updated",
                    Icon = "assets/icons/icon-512x512.png"
                }
            };

            var config = new VapidConfiguration();
            _configuration.GetSection("VAPID").Bind(config);
            var webPushSub = new PushSubscription(subscription.Endpoint, subscription.KeysP256DH, subscription.KeysAuth);
            await client.SendNotificationAsync(webPushSub, JsonConvert.SerializeObject(vapidNotification), new VapidDetails("mailto:dean@dashwood.com", config.PublicKey, config.PrivateKey));
        }
    }
}
