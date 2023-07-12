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
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<MealPlanDto>> Put(MealPlanUpdateDto dto)
    {
        // Update
        var updateRequest = new SaveMealPlanRequest
        {
            Date = dto.Date,
            LocationId = dto.LocationId,
            MealDescription = dto.MealDescription,
            PeopleIds = dto.PeopleIds,
            Delivery = dto.Delivery
        };

        await _mediator.Send(updateRequest);

        // Get saved data for returning to client
        var getRequest = new GetMealPlanRequest { StartDate = dto.Date, EndDate = dto.Date };
        var result = (await _mediator.Send(getRequest)).FirstOrDefault();

        return CreatedAtAction(nameof(Get), new { startDate = dto.Date, endDate = dto.Date}, _mapper.Map<MealPlanDto>(result));
    }
}
