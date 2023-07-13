using MediatR;

namespace MealPlan.Application.MealPlan.Commands.SaveMealPlan;

public class SaveMealPlanRequest : IRequest
{
    public DateOnly Date { get; set; }
    public string? MealDescription { get; set; }
    public bool Delivery { get; set; }
    public string? OtherPeople { get; set; }
    public string? Notes { get; set; }

    public Guid LocationId { get; set; }
    public List<Guid> PeopleIds { get; set; } = new List<Guid>();
}