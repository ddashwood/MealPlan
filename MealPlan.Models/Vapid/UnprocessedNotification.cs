namespace MealPlan.Models.Vapid;

public class UnprocessedNotification
{
    public int Id { get; set; }
    public DateTime DateTime { get; set; }
    public DateOnly AlteredDate { get; set; }
    public string Username { get; set; } = "";
    public string UserId { get; set; } = "";
}
