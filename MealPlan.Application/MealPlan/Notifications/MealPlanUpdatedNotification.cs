using MediatR;

namespace MealPlan.Application.MealPlan.Notifications;

public class MealPlanUpdatedNotification : INotification
{
    public DateOnly Date { get; set; }
    public string UserId { get; set; } = "";
}
