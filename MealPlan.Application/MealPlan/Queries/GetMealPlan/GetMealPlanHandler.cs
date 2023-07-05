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
        var existingEntries = await _context.MealPlanEntries
                        .Where(e => e.Date >= request.StartDate && e.Date <= request.EndDate)
                        .Include(e => e.People)
                        .Include(e => e.Location)
                        .OrderBy(e => e.Date)
                        .AsSplitQuery()
                        .ToListAsync();

        var results = new List<MealPlanEntry>();

        var existingEnumerator = existingEntries.GetEnumerator();
        existingEnumerator.MoveNext();
        for (DateOnly date = request.StartDate; date <= request.EndDate; date = date.AddDays(1))
        {
            if (existingEnumerator.Current?.Date == date)
            {
                results.Add(existingEnumerator.Current);
                existingEnumerator.MoveNext();
            }
            else
            {
                results.Add(new MealPlanEntry { Date = date });
            }
        }

        return results;
    }
}
