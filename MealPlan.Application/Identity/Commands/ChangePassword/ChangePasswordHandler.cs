using System.Security.Claims;
using MealPlan.Models.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;


namespace MealPlan.Application.Identity.Commands.ChangePassword;

public class ChangePasswordHandler : IRequestHandler<ChangePasswordRequest, List<string>>
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ChangePasswordHandler(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<List<string>> Handle(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByNameAsync(request.User.Claims.First(c => c.Type == ClaimTypes.Name).Value);

        if (user == null)
        {
            return new List<string> { "Can't find user" };
        }

        var result = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);

        if (result.Succeeded)
        {
            return new List<string>();
        }

        return result.Errors.Select(e => e.Description).ToList();
    }
}