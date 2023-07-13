using AutoMapper;
using MealPlan.Application.DTOs.MealPlan;
using Shared.Helpers.Mapping;

namespace MealPlan;

public class StartupAutoMapper : Profile
{
    public StartupAutoMapper()
    {
        this.AddMapFromAttributes(typeof(StartupAutoMapper).Assembly);
        this.AddMapFromAttributes(typeof(MealPlanDto).Assembly);
    }
}
