namespace MealPlan.Application.Identity.Queries.Login;

public class LoginResponse
{
    public bool Success { get; init; }
    public string? Jwt { get; init; }
}
