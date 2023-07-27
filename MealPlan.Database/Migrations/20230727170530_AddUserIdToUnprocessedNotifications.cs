using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealPlan.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToUnprocessedNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "UnprocessedNotifications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UnprocessedNotifications");
        }
    }
}
