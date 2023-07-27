using MealPlan.Database.Contexts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MealPlan.Application.Vapid.Commands;

public class SaveSubscriptionHandler : IRequestHandler<SaveSubscriptionRequest>
{
    private readonly MealPlanContext _context;

    public SaveSubscriptionHandler(MealPlanContext context)
    {
        _context = context;
    }

    public async Task Handle(SaveSubscriptionRequest request, CancellationToken cancellationToken)
    {
        var existing = await _context.VapidSubscriptions.SingleOrDefaultAsync(s => s.Endpoint == request.Subscription.Endpoint);

        if (existing != null)
        {
            _context.ChangeTracker.Clear();
            _context.Update(request.Subscription);
        }
        else
        {
            _context.VapidSubscriptions.Add(request.Subscription);
        }

        await _context.SaveChangesAsync();
    }
}
