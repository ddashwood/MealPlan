using AutoMapper;
using MealPlan.Application.MealPlan.Commands.SaveMealPlan;
using MealPlan.Application.MealPlan.Queries.GetMealPlan;
using MealPlan.DTOs.MealPlan;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlan.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "viewer,editor")]
public class MealPlanController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public MealPlanController(IMediator mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MealPlanDto>>> Get(DateOnly startDate, DateOnly endDate)
    {
        var request = new GetMealPlanRequest { StartDate = startDate, EndDate = endDate };
        var result = await _mediator.Send(request);

        return _mapper.Map<List<MealPlanDto>>(result);
    }

    [HttpPut]
    [Authorize(Roles = "editor")]
    public async Task<ActionResult> Put(MealPlanUpdateDto dto)
    {
        var request = new SaveMealPlanRequest
        {
            Date = dto.Date,
            LocationId = dto.LocationId,
            MealDescription = dto.MealDescription,
            PeopleIds = dto.PeopleIds
        };

        await _mediator.Send(request);

        return Ok();
    }
}
