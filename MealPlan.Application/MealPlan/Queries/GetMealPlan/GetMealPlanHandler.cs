using MealPlan.Database.Contexts;
using MealPlan.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace MealPlan.Application.MealPlan.Queries.GetMealPlan;

internal class GetMealPlanHandler : IRequestHandler<GetMealPlanRequest, IEnumerable<MealPlanEntry>>
{
    private readonly MealPlanContext _context;

    public GetMealPlanHandler(MealPlanContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MealPlanEntry>> Handle(GetMealPlanRequest request, CancellationToken cancellationToken)
    {
        var results = await _context.MealPlanEntries
                        .Where(e => e.Date >= request.StartDate && e.Date <= request.EndDate)
                        .Include(e => e.People)
                        .Include(e => e.Location)
                        .AsSplitQuery()
                        .ToListAsync();

        return results;
    }
}
