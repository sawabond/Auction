using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Auction.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedAuctionConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "auction",
                table: "Auctions",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                schema: "auction",
                table: "Auctions",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_Auctions_Name",
                schema: "auction",
                table: "Auctions",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Auctions_StartTime",
                schema: "auction",
                table: "Auctions",
                column: "StartTime",
                descending: new bool[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Auctions_Name",
                schema: "auction",
                table: "Auctions");

            migrationBuilder.DropIndex(
                name: "IX_Auctions_StartTime",
                schema: "auction",
                table: "Auctions");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "auction",
                table: "Auctions",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                schema: "auction",
                table: "Auctions",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);
        }
    }
}
