using MealPlan.Models;
using MediatR;

namespace MealPlan.Application.People.Queries;

public class GetPeopleRequest : IRequest<IEnumerable<Person>>
{
}
