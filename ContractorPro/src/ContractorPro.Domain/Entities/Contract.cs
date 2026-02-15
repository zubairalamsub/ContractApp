namespace ContractorPro.Domain.Entities;

public class Contract
{
    public int Id { get; set; }
    public string ContractNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Client { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal TotalBudget { get; set; }
    public decimal SpentAmount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = "Draft"; // Draft, Active, Completed, Cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ContractItem> Items { get; set; } = new List<ContractItem>();
}
