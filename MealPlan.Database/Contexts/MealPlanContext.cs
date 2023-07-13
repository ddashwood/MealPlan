using MealPlan.Models;
using MealPlan.Models.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MealPlan.Database.Contexts;

public class MealPlanContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
{
    public MealPlanContext(DbContextOptions<MealPlanContext> options)
        :base(options)
    { }

    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Person> People => Set<Person>();
    public DbSet<MealPlanEntry> MealPlanEntries => Set<MealPlanEntry>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        base.ConfigureConventions(configurationBuilder);

        configurationBuilder.Properties<DateOnly>()
            .HaveConversion<DateOnlyConverter>()
            .HaveColumnType("date");
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<MealPlanEntry>(entity =>
        {
            entity.HasKey(e => e.Date);
            entity.Property(e => e.Delivery).IsRequired().HasDefaultValue(false);
        });

        builder.Entity<Person>(entity => {
            entity.Property(e => e.IsDefault).IsRequired().HasDefaultValue(false);
        });
    }
}
