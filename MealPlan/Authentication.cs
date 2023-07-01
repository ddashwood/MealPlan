using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace MealPlan;

public static class Authentication
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration _configuration)
    {
        var publicKey = _configuration["Jwt:PublicKey"];
        if (publicKey == null)
        {
            throw new InvalidOperationException("Missing configuration: Jwt:PublicKey");
        }

        RSA rsa = RSA.Create();

        rsa.ImportRSAPublicKey(
            source: Convert.FromBase64String(publicKey),
            bytesRead: out int _
        );

        var rsaKey = new RsaSecurityKey(rsa);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        // Adding Jwt Bearer
        .AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.RequireHttpsMetadata = false;
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidAudience = _configuration["JWT:ValidAudience"],
                ValidIssuer = _configuration["JWT:ValidIssuer"],
                IssuerSigningKey = rsaKey
            };
        });

        return services;
    }
}
