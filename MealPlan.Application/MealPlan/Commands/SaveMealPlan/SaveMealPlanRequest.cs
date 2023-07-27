using MealPlan.Application.DTOs.MealPlan;
using MediatR;
using Shared.Helpers.Mapping;

namespace MealPlan.Application.MealPlan.Commands.SaveMealPlan;

[MapFrom(typeof(MealPlanUpdateDto))]
public class SaveMealPlanRequest : IRequest
{
    public DateOnly Date { get; set; }
    public string? MealDescription { get; set; }
    public bool Delivery { get; set; }
    public string? OtherPeople { get; set; }
    public string? Notes { get; set; }

    public Guid LocationId { get; set; }
    public List<Guid> PeopleIds { get; set; } = new List<Guid>();
    public string UserId { get; set; } = "";
}