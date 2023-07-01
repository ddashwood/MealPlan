using MealPlan.Application.Identity.Queries.Login;
using MealPlan.Database.Contexts;
using MealPlan.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddMediatR(options => options.RegisterServicesFromAssembly(typeof(LoginRequest).Assembly));
builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<MealPlanContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("MealPlanConnection")));
builder.Services.AddDefaultIdentity<ApplicationUser>()
    .AddRoles<ApplicationRole>()
    .AddEntityFrameworkStores<MealPlanContext>();

var app = builder.Build();

// Add a default user
using (var defaultUserScope = app.Services.CreateScope())
{
    var userManager = defaultUserScope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var admin = await userManager.FindByNameAsync("admin");
    if (admin == null)
    {
        admin = new ApplicationUser
        {
            UserName = "admin",
            Email = "admin@dashwood.world",
            EmailConfirmed = true,
        };
        var result = await userManager.CreateAsync(admin, "Pa$$w0rd");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
