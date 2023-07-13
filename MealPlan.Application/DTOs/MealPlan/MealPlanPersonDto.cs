using MealPlan.Models;
using Shared.Helpers.Mapping;

namespace MealPlan.Application.DTOs.MealPlan;

[MapFrom(typeof(Person))]
public class MealPlanPersonDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public string ForegroundColour { get; set; } = string.Empty;
    public string BackgroundColour { get; set; } = string.Empty;
}
