using MealPlan.Models;
using Shared.Helpers.Mapping;

namespace MealPlan.DTOs.MealPlan;

[MapFrom(typeof(MealPlanEntry))]
public class MealPlanDto
{
    public DateOnly Date { get; set; }
    public string MealDescription { get; set; } = string.Empty;

    public LocationDto Location { get; set; } = null!;
    public List<PersonDto> People { get; set; } = null!;

}
