using MealPlan.Models.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VapidPublicKeyController : ControllerBase
    {
        public IConfiguration _configuration;

        public VapidPublicKeyController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public string Get()
        {
            var config = new VapidConfiguration();
            _configuration.GetSection("VAPID").Bind(config);

            return config.PublicKey;
        }
    }
}
