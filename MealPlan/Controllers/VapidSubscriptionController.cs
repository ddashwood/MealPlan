using AutoMapper;
using MealPlan.Application.DTOs.Vapid;
using MealPlan.Models.Vapid;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlan.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class VapidSubscriptionController : ControllerBase
{
    private IMapper _mapper;

    public VapidSubscriptionController(IMapper mapper)
    {
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> Post(SubscriptionDto subscriptionDto)
    {
        var subscription = _mapper.Map<VapidSubscription>(subscriptionDto);

        return Ok();
    }
}
