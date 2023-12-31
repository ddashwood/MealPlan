﻿using MealPlan.Models;
using Shared.Helpers.Mapping;

namespace MealPlan.Application.DTOs.Locations;

[MapFrom(typeof(Location))]
public class LocationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ForegroundColour { get; set; } = string.Empty;
    public string BackgroundColour { get; set; } = string.Empty;
}
