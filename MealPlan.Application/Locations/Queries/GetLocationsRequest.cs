using MealPlan.Models;
using MediatR;

namespace MealPlan.Application.Locations.Queries;

public class GetLocationsRequest : IRequest<IEnumerable<Location>>
{
}
