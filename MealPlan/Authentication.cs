using MealPlan.Models.Configuration;
using MealPlan.Models.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace MealPlan;

public static class Authentication
{
    public static async Task AddAdminUser(this WebApplication app)
    {
        using (var defaultUserScope = app.Services.CreateScope())
        {
            var roleManager = defaultUserScope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var userManager = defaultUserScope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            var adminRole = await roleManager.FindByNameAsync("admin");
            if (adminRole == null)
            {
                adminRole = new ApplicationRole { Name = "admin" };
                var result = await roleManager.CreateAsync(adminRole);
                ThrowIfFail(result, "create admin role");
            }

            var viewerRole = await roleManager.FindByNameAsync("viewer");
            if (viewerRole == null)
            {
                viewerRole = new ApplicationRole { Name = "viewer" };
                var result = await roleManager.CreateAsync(viewerRole);
                ThrowIfFail(result, "create viewer role");
            }

            var editorRole = await roleManager.FindByNameAsync("editor");
            if (editorRole == null)
            {
                editorRole = new ApplicationRole { Name = "editor" };
                var result = await roleManager.CreateAsync(editorRole);
                ThrowIfFail(result, "create editor role");
            }

            var adminUser = await userManager.FindByNameAsync("admin");
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = "admin",
                    Email = "admin@dashwood.world",
                    EmailConfirmed = true,
                };
                var result = await userManager.CreateAsync(adminUser, "Pa$$w0rd");
                ThrowIfFail(result, "create admin user");
                result = await userManager.AddToRoleAsync(adminUser, "admin");
                ThrowIfFail(result, "asign admin role to admin user");
                result = await userManager.AddToRoleAsync(adminUser, "viewer");
                ThrowIfFail(result, "asign admin role to viewer user");
                result = await userManager.AddToRoleAsync(adminUser, "editor");
                ThrowIfFail(result, "asign admin role to editor user");
            }
        }
    }

    private static void ThrowIfFail(IdentityResult identityResult, string taskDescription)
    {
        if (!identityResult.Succeeded)
        {
            throw new ApplicationException($"Failed to {taskDescription}: {string.Join(", ", identityResult.Errors.Select(e => e.Description))}");
        }
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtOptions = new JwtConfiguration();
        configuration.GetSection("Jwt").Bind(jwtOptions);

        var publicKey = jwtOptions.PublicKey;
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
                ValidAudience = jwtOptions.ValidAudience,
                ValidIssuer = jwtOptions.ValidIssuer,
                IssuerSigningKey = rsaKey
            };
        });

        return services;
    }
}
