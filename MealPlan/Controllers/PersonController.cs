using AutoMapper;
using MealPlan.Application.People.Queries;
using MealPlan.Application.DTOs.People;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlan.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "viewer,editor")]
public class PersonController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public PersonController(IMediator mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonDto>>> Get()
    {
        var results = await _mediator.Send(new GetPeopleRequest());

        return _mapper.Map<List<PersonDto>>(results);
    }
}
