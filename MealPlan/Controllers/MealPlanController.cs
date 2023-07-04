using MealPlan.Application.MealPlan.Queries.GetMealPlan;
using MealPlan.DTOs.MealPlan;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MealPlan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "viewer,editor")]
    public class MealPlanController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MealPlanController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<MealPlanDto>> Get(DateOnly startDate, DateOnly endDate)
        {
            var request = new GetMealPlanRequest { StartDate = startDate, EndDate = endDate };
            var result = await _mediator.Send(request);

            return new MealPlanDto();
        }
    }
}
