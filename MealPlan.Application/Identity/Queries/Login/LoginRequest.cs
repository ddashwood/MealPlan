using MediatR;

namespace MealPlan.Application.Identity.Queries.Login;

public class LoginRequest : IRequest<LoginResponse>
{
    public LoginRequest(string userName, string password)
    {
        UserName = userName;
        Password = password;
    }

    public string UserName { get; }
    public string Password { get; }
}
