namespace MealPlan.Application.DTOs.Identity;

public class ChangePasswordDto
{
    public string OldPassword { get; set;} = "";
    public string NewPassword { get; set;} = "";
}