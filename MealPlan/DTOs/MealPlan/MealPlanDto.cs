using MealPlan.Models;
using Shared.Helpers.Mapping;

namespace MealPlan.DTOs.MealPlan;

[MapFrom(typeof(MealPlanEntry))]
public class MealPlanDto
{
    public DateOnly Date { get; set; }
    public string? MealDescription { get; set; } = string.Empty;
    public bool Delivery { get; set; }
    public string? OtherPeople { get; set; }
    public string? Notes { get; set; }
    public MealPlanLocationDto Location { get; set; } = null!;
    public List<MealPlanPersonDto> People { get; set; } = null!;

}
