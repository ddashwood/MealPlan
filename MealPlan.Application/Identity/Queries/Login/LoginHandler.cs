using MealPlan.Models.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace MealPlan.Application.Identity.Queries.Login;

public class LoginHandler : IRequestHandler<LoginRequest, LoginResponse>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public LoginHandler(UserManager<ApplicationUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<LoginResponse> Handle(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByNameAsync(request.UserName);
        if (user != null && await _userManager.CheckPasswordAsync(user, request.Password))
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
                {
                    new Claim(type:ClaimTypes.Name, value:user.UserName!),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(type:ClaimTypes.Role, value:userRole));
            }

            var token = GetToken(authClaims);
            return new LoginResponse { Success = true, Jwt = token };
        }

        return new LoginResponse { Success = false };
    }

    private string GetToken(List<Claim> authClaims)
    {
        string result;
        var privateKey = _configuration["Jwt:PrivateKey"];
        if (privateKey == null)
        {
            throw new InvalidOperationException("Missing configuration: Jwt:PrivateKey");
        }

        using (RSA rsa = RSA.Create())
        {
            rsa.ImportRSAPrivateKey( // Convert the loaded key from base64 to bytes.
                source: Convert.FromBase64String(privateKey), // Use the private key to sign tokens
                bytesRead: out int _); // Discard the out variable 

            // See here for why this is needed: https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/issues/1433
            var key = new RsaSecurityKey(rsa)
            {
                CryptoProviderFactory = new CryptoProviderFactory()
                {
                    CacheSignatureProviders = false
                }
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.RsaSha256)
                );

            var handler = new JwtSecurityTokenHandler();
            result = handler.WriteToken(token);
        }
        return result;
    }
}
