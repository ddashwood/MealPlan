using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealPlan.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddVapidSubscriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VapidSubscriptions",
                columns: table => new
                {
                    Endpoint = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ExpirationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    KeysP256DH = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KeysAuth = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VapidSubscriptions", x => x.Endpoint);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VapidSubscriptions");
        }
    }
}
