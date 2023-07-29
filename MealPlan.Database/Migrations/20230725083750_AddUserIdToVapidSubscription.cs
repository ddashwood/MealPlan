using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealPlan.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToVapidSubscription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "VapidSubscriptions",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_VapidSubscriptions_UserId",
                table: "VapidSubscriptions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_VapidSubscriptions_AspNetUsers_UserId",
                table: "VapidSubscriptions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VapidSubscriptions_AspNetUsers_UserId",
                table: "VapidSubscriptions");

            migrationBuilder.DropIndex(
                name: "IX_VapidSubscriptions_UserId",
                table: "VapidSubscriptions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "VapidSubscriptions");
        }
    }
}
