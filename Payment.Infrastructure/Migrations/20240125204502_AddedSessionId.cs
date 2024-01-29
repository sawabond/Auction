using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payment.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedSessionId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SessionId",
                schema: "payment",
                table: "Payments",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SessionId",
                schema: "payment",
                table: "Payments");
        }
    }
}
