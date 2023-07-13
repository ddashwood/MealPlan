using MealPlan.Models;
using Shared.Helpers.Mapping;

namespace MealPlan.Application.DTOs.People;

[MapFrom(typeof(Person))]
public class PersonDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ForegroundColour { get; set; } = string.Empty;
    public string BackgroundColour { get; set; } = string.Empty;
}
