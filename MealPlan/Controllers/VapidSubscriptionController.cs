using MealPlan.Application.DTOs.Vapid;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlan.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class VapidSubscriptionController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Post(SubscriptionDto subscription)
    {
        return Ok();
    }
}
