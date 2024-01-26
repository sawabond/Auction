using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Auction.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedOnCascadeDeleteForAuctionAggregate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuctionItemPhotos_AuctionItems_AuctionItemId",
                schema: "auction",
                table: "AuctionItemPhotos");

            migrationBuilder.DropForeignKey(
                name: "FK_AuctionItems_Auctions_AuctionId",
                schema: "auction",
                table: "AuctionItems");

            migrationBuilder.AlterColumn<Guid>(
                name: "AuctionId",
                schema: "auction",
                table: "AuctionItems",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "AuctionItemId",
                schema: "auction",
                table: "AuctionItemPhotos",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AuctionItemPhotos_AuctionItems_AuctionItemId",
                schema: "auction",
                table: "AuctionItemPhotos",
                column: "AuctionItemId",
                principalSchema: "auction",
                principalTable: "AuctionItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AuctionItems_Auctions_AuctionId",
                schema: "auction",
                table: "AuctionItems",
                column: "AuctionId",
                principalSchema: "auction",
                principalTable: "Auctions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuctionItemPhotos_AuctionItems_AuctionItemId",
                schema: "auction",
                table: "AuctionItemPhotos");

            migrationBuilder.DropForeignKey(
                name: "FK_AuctionItems_Auctions_AuctionId",
                schema: "auction",
                table: "AuctionItems");

            migrationBuilder.AlterColumn<Guid>(
                name: "AuctionId",
                schema: "auction",
                table: "AuctionItems",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "AuctionItemId",
                schema: "auction",
                table: "AuctionItemPhotos",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_AuctionItemPhotos_AuctionItems_AuctionItemId",
                schema: "auction",
                table: "AuctionItemPhotos",
                column: "AuctionItemId",
                principalSchema: "auction",
                principalTable: "AuctionItems",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AuctionItems_Auctions_AuctionId",
                schema: "auction",
                table: "AuctionItems",
                column: "AuctionId",
                principalSchema: "auction",
                principalTable: "Auctions",
                principalColumn: "Id");
        }
    }
}
