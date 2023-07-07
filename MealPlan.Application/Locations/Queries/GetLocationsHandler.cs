using MealPlan.Database.Contexts;
using MealPlan.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace MealPlan.Application.Locations.Queries;

public class GetLocationsHandler : IRequestHandler<GetLocationsRequest, IEnumerable<Location>>
{
    private readonly MealPlanContext _context;

    public GetLocationsHandler(MealPlanContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Location>> Handle(GetLocationsRequest request, CancellationToken cancellationToken)
    {
        return await _context.Locations.OrderBy(l => l.Name).ToListAsync();
    }
}
