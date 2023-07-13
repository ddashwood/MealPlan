using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealPlan.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddOtherPeopleAndNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "MealDescription",
                table: "MealPlanEntries",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "MealPlanEntries",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtherPeople",
                table: "MealPlanEntries",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "MealPlanEntries");

            migrationBuilder.DropColumn(
                name: "OtherPeople",
                table: "MealPlanEntries");

            migrationBuilder.AlterColumn<string>(
                name: "MealDescription",
                table: "MealPlanEntries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
