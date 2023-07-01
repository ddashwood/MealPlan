namespace MealPlan.Application.Identity.Queries.Login;

public class LoginResponse
{
    public bool Success { get; private init; }
    public string? Jwt { get; private init; }

    public static LoginResponse CreateSuccessResponse(string jwt)
    {
        return new LoginResponse { Success = true, Jwt = jwt };
    }

    public static LoginResponse CreateFailureResponse()
    {
        return new LoginResponse { Success = false };
    }
}
