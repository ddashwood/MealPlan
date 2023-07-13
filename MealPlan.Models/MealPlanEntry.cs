namespace MealPlan.Models;

public class MealPlanEntry
{
    public DateOnly Date { get; set; }
    public string? MealDescription { get; set; }

    public Location? Location { get; set; }
    public List<Person> People { get; set; } = new List<Person>();

    public bool Delivery { get; set; }
    public string? OtherPeople { get; set; }
    public string? Notes { get; set; }
}
