using MealPlan.Database.Contexts;
using MealPlan.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace MealPlan.Application.People.Queries;

public class GetPeopleHandler : IRequestHandler<GetPeopleRequest, IEnumerable<Person>>
{
    private readonly MealPlanContext _context;

    public GetPeopleHandler(MealPlanContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Person>> Handle(GetPeopleRequest request, CancellationToken cancellationToken)
    {
        return await _context.People.OrderBy(p => p.Name).ToListAsync();
    }
}
