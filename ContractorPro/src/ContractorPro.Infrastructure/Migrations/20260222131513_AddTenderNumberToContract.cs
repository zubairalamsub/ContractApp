using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContractorPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTenderNumberToContract : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TenderNumber",
                table: "Contracts",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenderNumber",
                table: "Contracts");
        }
    }
}
