﻿using Auth.Core.User.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Auth.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedShipmentInformation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<ShipmentInformation>(
                name: "ShipmentInformation",
                table: "AspNetUsers",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShipmentInformation",
                table: "AspNetUsers");
        }
    }
}
