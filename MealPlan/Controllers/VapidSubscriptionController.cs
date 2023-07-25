using AutoMapper;
using MealPlan.Application.DTOs.Vapid;
using MealPlan.Application.Vapid.Commands;
using MealPlan.Models.Identity;
using MealPlan.Models.Vapid;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MealPlan.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class VapidSubscriptionController : ControllerBase
{
    private IMapper _mapper;
    private IMediator _mediator;
    private UserManager<ApplicationUser> _userManager;

    public VapidSubscriptionController(IMapper mapper, IMediator mediator, UserManager<ApplicationUser> userManager)
    {
        _mapper = mapper;
        _mediator = mediator;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> Post(SubscriptionDto subscriptionDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            // Early version of the software did not add the NameIdentifier claim, so we need to use the Name claim instead
            var user = await _userManager.FindByNameAsync(User.FindFirstValue(ClaimTypes.Name) ?? "");
            userId = user?.Id;
        }

        if (userId == null)
        {
            throw new ApplicationException("Can't find details of the current user");
        }

        var subscription = _mapper.Map<VapidSubscription>(subscriptionDto);
        subscription.UserId = userId;
        var request = new SaveSubscriptionRequest(subscription);
        await _mediator.Send(request);

        return Ok();
    }
}
