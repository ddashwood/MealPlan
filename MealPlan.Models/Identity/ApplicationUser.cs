using MealPlan.Models.Vapid;
using Microsoft.AspNetCore.Identity;

namespace MealPlan.Models.Identity;

public class ApplicationUser : IdentityUser
{
    public List<VapidSubscription> VapidSubscriptions { get; set; } = new List<VapidSubscription>();
}
