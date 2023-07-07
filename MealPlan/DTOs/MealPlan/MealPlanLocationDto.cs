using MealPlan.Models;
using Shared.Helpers.Mapping;

namespace MealPlan.DTOs.MealPlan;

[MapFrom(typeof(Location))]
public class MealPlanLocationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public string ForegroundColour { get; set; } = string.Empty;
    public string BackgroundColour { get; set; } = string.Empty;
}
