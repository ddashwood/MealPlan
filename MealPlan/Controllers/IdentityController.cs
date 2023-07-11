using MealPlan.Application.Identity.Queries.Login;
using MealPlan.DTOs.Identity;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MealPlan.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IdentityController : ControllerBase
{
    private readonly IMediator _mediator;

    public IdentityController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("Login")]
    public async Task<ActionResult<string>> Login(LoginDto dto)
    {
        var request = new LoginRequest(dto.UserName, dto.Password);
        var result = await _mediator.Send(request);
        if (result.Success)
        {
            return result.Jwt!;
        }
        return Unauthorized();
    }

    [HttpPut("Password")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(List<string>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<string>>> ChangePassword(ChangePasswordDto dto)
    {
        return Ok();
    }
}
