namespace MealPlan.Models;

public class MealPlanEntry
{
    public DateOnly Date { get; set; }
    public string MealDescription { get; set; } = string.Empty;
    public Location Location { get; set; } = null!;
    public List<Person> People { get; set; } = null!;
}
