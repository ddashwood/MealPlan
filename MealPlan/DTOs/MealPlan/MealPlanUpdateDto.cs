using MealPlan.Models;
using Shared.Helpers.Mapping;

namespace MealPlan.DTOs.MealPlan;

public class MealPlanUpdateDto
{
    public DateOnly Date { get; set; }
    public string MealDescription { get; set; } = string.Empty;
    public bool Delivery { get; set; }

    public Guid LocationId { get; set; }
    public List<Guid> PeopleIds { get; set; } = new List<Guid>();

}
