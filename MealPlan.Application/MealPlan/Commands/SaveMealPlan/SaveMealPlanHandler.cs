using MealPlan.Application.MealPlan.Notifications;
using MealPlan.Database.Contexts;
using MealPlan.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MealPlan.Application.MealPlan.Commands.SaveMealPlan;

public class SaveMealPlanHandler : IRequestHandler<SaveMealPlanRequest>
{
    private readonly MealPlanContext _context;
    private readonly IMediator _mediator;

    public SaveMealPlanHandler(MealPlanContext context, IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    public async Task Handle(SaveMealPlanRequest request, CancellationToken cancellationToken)
    {
        var existing = await _context.MealPlanEntries
            .Include(e => e.People)
            .FirstOrDefaultAsync(e => e.Date == request.Date, CancellationToken.None);
        if (existing != null)
        {
            UpdateExisting(existing, request);
        }
        else
        {
            CreateNew(request);
        }

        await _context.SaveChangesAsync(CancellationToken.None);

        // We have attached incomplete entities, so we need to clear them
        // to ensure they aren't returned from future queries
        _context.ChangeTracker.Clear();


        var notification = new MealPlanUpdatedNotification { Date = request.Date, UserId = request.UserId, UserName = request.UserName };
        await _mediator.Publish(notification);
    }

    private void UpdateExisting(MealPlanEntry existing, SaveMealPlanRequest request)
    {
        existing.MealDescription = request.MealDescription;
        existing.Delivery = request.Delivery;
        existing.OtherPeople = request.OtherPeople;
        existing.Notes = request.Notes;

        var location = new Location { Id = request.LocationId };
        _context.Attach(location);
        existing.Location = location;

        var peopleToRemove = existing.People.Where(ep => !request.PeopleIds.Contains(ep.Id)).ToList();
        var peopleToAdd = request.PeopleIds.Where(p => !existing.People.Any(ep => ep.Id == p)).ToList();

        // Remove people that were on the meal plan for this day but are not any more
        foreach (var personToRemove in peopleToRemove)
        {
            existing.People.Remove(personToRemove);
        }

        // Add people that have been newly added to the meal plan for this day
        foreach (var personToAdd in peopleToAdd)
        {
            var person = new Person { Id = personToAdd };
            _context.Attach(person);

            existing.People.Add(person);
        }
    }

    private void CreateNew(SaveMealPlanRequest request)
    {
        var entry = new MealPlanEntry
        {
            Date = request.Date,
            MealDescription = request.MealDescription,
            Delivery = request.Delivery,
            OtherPeople = request.OtherPeople,
            Notes = request.Notes
        };

        var location = new Location { Id = request.LocationId };
        _context.Attach(location);
        entry.Location = location;

        entry.People = new List<Person>();

        foreach(var personId in request.PeopleIds)
        {
            var person = new Person { Id = personId };
            _context.Attach(person);

            entry.People.Add(person);
        }

        _context.MealPlanEntries.Add(entry);
    }
}