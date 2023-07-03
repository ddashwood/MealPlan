namespace MealPlan.Models.Configuration;

public class JwtConfiguration
{
    public string ValidAudience { get; set; } = "";
    public string ValidIssuer { get; set; } = "";
    public string PublicKey { get; set; } = "";
    public string PrivateKey { get; set; } = "";
    public int ValidForHours { get; set; }
}
