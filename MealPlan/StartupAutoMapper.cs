using AutoMapper;
using Shared.Helpers.Mapping;

namespace MealPlan;

public class StartupAutoMapper : Profile
{
    public StartupAutoMapper()
    {
        this.AddMapFromAttributes(typeof(StartupAutoMapper).Assembly);
    }
}
