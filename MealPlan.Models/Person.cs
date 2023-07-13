namespace MealPlan.Models;

public class Person
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public string ForegroundColour { get; set; } = string.Empty;
    public string BackgroundColour { get; set; } = string.Empty;
    public bool IsDefault { get; set;}

    public List<MealPlanEntry> MealPlanEntries { get; set; } = null!;
}
