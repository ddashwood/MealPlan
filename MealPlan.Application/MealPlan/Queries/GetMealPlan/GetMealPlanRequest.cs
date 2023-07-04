using MealPlan.Models;
using MediatR;

namespace MealPlan.Application.MealPlan.Queries.GetMealPlan;

public class GetMealPlanRequest: IRequest<IEnumerable<MealPlanEntry>>
{
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}
