using MealPlan.Application.MealPlan.Notifications;
using MealPlan.Database.Contexts;
using MealPlan.Models.Configuration;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PushnotificationsDemo.Models;
using WebPush;

namespace MealPlan.Application.Vapid.NotificationHandlers;

public class MealPlanUpdatedHandler : INotificationHandler<MealPlanUpdatedNotification>
{
    private readonly ILogger<MealPlanUpdatedHandler> _logger;
    private readonly MealPlanContext _context;
    private readonly IConfiguration _configuration;

    public MealPlanUpdatedHandler(ILogger<MealPlanUpdatedHandler> logger, MealPlanContext context, IConfiguration configuration)
    {
        _logger = logger;
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
            if (subscription.UserId == notification.UserId)
            {
                continue; // No need to notify the same user that made the change
            }

            try
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
            catch (WebPushException e)
            {
                if (e.Message == "Subscription no longer valid")
                {
                    _context.VapidSubscriptions.Remove(subscription);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    _logger.LogError(e, "Error pushing VAPID notification");
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error pushing VAPID notification");
            }
        }
    }
}
