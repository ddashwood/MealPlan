using AutoMapper;
using MealPlan.Application.DTOs.Vapid;
using MealPlan.Application.Vapid.Commands;
using MealPlan.Models.Vapid;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlan.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class VapidSubscriptionController : ControllerBase
{
    private IMapper _mapper;
    private IMediator _mediator;

    public VapidSubscriptionController(IMapper mapper, IMediator mediator)
    {
        _mapper = mapper;
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Post(SubscriptionDto subscriptionDto)
    {
        var subscription = _mapper.Map<VapidSubscription>(subscriptionDto);
        var request = new SaveSubscriptionRequest(subscription);
        await _mediator.Send(request);

        return Ok();
    }
}
