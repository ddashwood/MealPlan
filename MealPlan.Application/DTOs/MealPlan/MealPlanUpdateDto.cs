using MealPlan.Models;
using Shared.Helpers.Mapping;

namespace MealPlan.Application.DTOs.MealPlan;

public class MealPlanUpdateDto
{
    public DateOnly Date { get; set; }
    public string? MealDescription { get; set; }
    public bool Delivery { get; set; }
    public string? OtherPeople { get; set; }
    public string? Notes { get; set; }
    public Guid LocationId { get; set; }
    public List<Guid> PeopleIds { get; set; } = new List<Guid>();

}
