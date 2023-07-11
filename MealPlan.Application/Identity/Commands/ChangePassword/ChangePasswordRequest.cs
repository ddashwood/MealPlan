using System.Security.Claims;
using MediatR;

namespace MealPlan.Application.Identity.Commands.ChangePassword;

public class ChangePasswordRequest: IRequest<List<string>>
{
    public ClaimsPrincipal User { get; set;}
    public string OldPassword { get; set;}
    public string NewPassword { get; set;}

    public ChangePasswordRequest(ClaimsPrincipal user, string oldPassword, string newPassword)
    {
        User = user;
        OldPassword = oldPassword;
        NewPassword = newPassword;
    }

}