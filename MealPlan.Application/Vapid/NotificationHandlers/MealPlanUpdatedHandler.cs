using MealPlan.Application.MealPlan.Notifications;
using MealPlan.Database.Contexts;
using MealPlan.Models.Configuration;
using MealPlan.Models.Vapid;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PushnotificationsDemo.Models;
using WebPush;

namespace MealPlan.Application.Vapid.NotificationHandlers;

public class MealPlanUpdatedHandler : INotificationHandler<MealPlanUpdatedNotification>, IDisposable
{
    private readonly ILogger<MealPlanUpdatedHandler> _logger;
    private readonly MealPlanContext _context;
    private readonly IConfiguration _configuration;
    private readonly IServiceScope _scope;
    private readonly NotificationsConfiguration _config;
    private bool _keepScope;

    private static Action<MealPlanUpdatedHandler> _sendNotificationsWithDebounce = null!;

    public MealPlanUpdatedHandler(ILogger<MealPlanUpdatedHandler> logger, MealPlanContext context, IConfiguration configuration, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _context = context;
        _configuration = configuration;
        _scope = serviceProvider.CreateScope();  // Create a new scope which gets disposed only when the debouncer has finished

        _config = new();
        configuration.GetSection("Notifications").Bind(_config);

        if (_sendNotificationsWithDebounce == null)
        {

            _sendNotificationsWithDebounce = DebounceGenerator(async handler =>
            {
                await handler.SendNotifications();
            }, _config.DelayBeforeSendingInSeconds * 1000);
        }
    }

    public async Task Handle(MealPlanUpdatedNotification notification, CancellationToken cancellationToken)
    {
        if (!_config.PreventNotifications)
        {
            // Add the notification to a table in the database
            var unprocessed = new UnprocessedNotification
            {
                AlteredDate = notification.Date,
                UserId = notification.UserId,
                Username = notification.UserName,
                DateTime = DateTime.UtcNow
            };
            
            _context.UnprocessedNotifications.Add(unprocessed);
            await _context.SaveChangesAsync();

            // Send a batch of notifications
            _sendNotificationsWithDebounce(this);
        }
    }

    private async Task SendNotifications()
    {
        try
        {
            // The context provided in the constructor will have been disposed before
            // this method gets called, because of the debouncing

            var context = _scope.ServiceProvider.GetRequiredService<MealPlanContext>();

            var notifications = await context.UnprocessedNotifications.ToListAsync();
            if (!notifications.Any())
            {
                return;
            }

            var latestNotification = notifications.Select(n => n.DateTime).Max();
            var timeSinceLastNotification = DateTime.UtcNow - latestNotification;
            if ((int)timeSinceLastNotification.TotalSeconds < _config.DelayBeforeSendingInSeconds)
            {
                // This will only ever happen in a distrubuted environment (which is unlikely anyway),
                // if another instance has handled updates more recently than this instance
                return;
            }

            var subscriptions = await context.VapidSubscriptions.ToListAsync();
            foreach (var subscription in subscriptions)
            {
                var notificationsFromOtherUsers = notifications.Where(n => n.UserId != subscription.UserId);
                if (!notificationsFromOtherUsers.Any())
                {
                    continue;
                }

                var updaters = notificationsFromOtherUsers.Select(n => n.Username).Distinct();
                string updater = updaters.Count() > 1 ? "multiple peole" : FirstCharToUpper(updaters.Single());

                var firstDate = notificationsFromOtherUsers.Select(n => n.AlteredDate).Min();
                var lastDate = notificationsFromOtherUsers.Select(n => n.AlteredDate).Max();
                string date = firstDate == lastDate ? firstDate.ToString("MMMM dd") :
                    $"some days between {firstDate.ToString("MMMM dd")} and {lastDate.ToString("MMMM dd")}";

                var message = $"Meal plan for {date} has been updated by {updater}";

                await NotifySubscription(message, subscription);
            }

            context.UnprocessedNotifications.RemoveRange(notifications);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error sending notifications");
        }
    }

    private async Task NotifySubscription(string message, VapidSubscription subscription)
    {
        // See https://github.com/MicrosoftEdge/pushnotifications-demo-aspnetcore/blob/main/PushnotificationsDemo/Services/PushService.cs

        var client = new WebPushClient();

        try
        {
            var vapidNotification = new NotificationContainer
            {
                Notification = new Notification
                {
                    Title = "Meal Plan updated",
                    Body = message,
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

    private static Action<MealPlanUpdatedHandler> DebounceGenerator(Func<MealPlanUpdatedHandler, Task> func, int milliseconds = 300)
    {
        CancellationTokenSource? cancelTokenSource = null;

        return handler =>
        {
            handler._keepScope = true;

            cancelTokenSource?.Cancel();
            cancelTokenSource = new CancellationTokenSource();

            Task.Delay(milliseconds, cancelTokenSource.Token)
                .ContinueWith(async t =>
                {
                    try
                    {
                        if (t.IsCompletedSuccessfully)
                        {
                            await func(handler);
                        }
                    }
                    finally
                    {
                        handler._scope?.Dispose();
                    }
                }, TaskScheduler.Default);
        };
    }

    private string FirstCharToUpper(string input)
    {
        switch (input)
        {
            case null: return "";
            case "": return "";
            default: return input[0].ToString().ToUpper() + input.Substring(1);
        }
    }

    public void Dispose()
    {
        if (!_keepScope)
        {
            _scope?.Dispose();
        }
    }
}
