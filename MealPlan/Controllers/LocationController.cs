using AutoMapper;
using MealPlan.Application.Locations.Queries;
using MealPlan.DTOs.Locations;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlan.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "viewer,editor")]
public class LocationController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public LocationController(IMediator mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LocationDto>>> Get()
    {
        var results = await _mediator.Send(new GetLocationsRequest());

        return _mapper.Map<List<LocationDto>>(results);
    }       
}
