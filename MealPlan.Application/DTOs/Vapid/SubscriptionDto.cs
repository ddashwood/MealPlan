namespace MealPlan.Application.DTOs.Vapid;


public class SubscriptionDto
{
    public string Endpoint { get; set; } = "";
    public DateTime? ExpirationTime { get; set; }
    public Keys Keys { get; set; } = new Keys();
}

public class Keys
{
    public string P256DH { get; set; } = "";
    public string Auth { get; set; } = "";
}

