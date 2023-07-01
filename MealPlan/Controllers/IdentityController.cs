using MealPlan.Application.Identity.Queries.Login;
using MealPlan.DTOs.Identity;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MealPlan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly IMediator _mediator;

        public IdentityController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginDto dto)
        {
            var request = new LoginRequest(dto.UserName, dto.Password);
            var result = await _mediator.Send(request);
            return result;
        }
    }
}
