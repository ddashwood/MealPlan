using AutoMapper;
using MealPlan.Application.MealPlan.Commands.SaveMealPlan;
using MealPlan.Application.MealPlan.Queries.GetMealPlan;
using MealPlan.Application.DTOs.MealPlan;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MealPlan.Models.Identity;
using Microsoft.AspNetCore.Identity;

namespace MealPlan.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "viewer,editor")]
public class MealPlanController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;
    private UserManager<ApplicationUser> _userManager;

    public MealPlanController(IMediator mediator, IMapper mapper, UserManager<ApplicationUser> userManager)
    {
        _mediator = mediator;
        _mapper = mapper;
        _userManager = userManager;
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
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        string? userName = User.FindFirstValue(ClaimTypes.Name);
        if (userId == null)
        {
            // Early version of the software did not add the NameIdentifier claim, so we need to use the Name claim instead
            var user = await _userManager.FindByNameAsync(User.FindFirstValue(ClaimTypes.Name) ?? "");
            userId = user?.Id;
            userName = user?.UserName;
        }
        
        // Update
        var updateRequest = _mapper.Map<SaveMealPlanRequest>(dto);
        updateRequest.UserId = userId ?? "";
        updateRequest.UserName = userName ?? "";

        await _mediator.Send(updateRequest);

        // Get saved data for returning to client
        var getRequest = new GetMealPlanRequest { StartDate = dto.Date, EndDate = dto.Date };
        var result = (await _mediator.Send(getRequest)).FirstOrDefault();

        return CreatedAtAction(nameof(Get), new { startDate = dto.Date, endDate = dto.Date}, _mapper.Map<MealPlanDto>(result));
    }
}
