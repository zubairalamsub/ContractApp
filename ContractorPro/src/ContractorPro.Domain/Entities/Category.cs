namespace ContractorPro.Domain.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Group { get; set; } = "ICT"; // ICT or Electrical
    public string Color { get; set; } = "#3B82F6"; // Hex color
    public bool IsDefault { get; set; } = false; // Default categories cannot be deleted
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ContractItem> Items { get; set; } = new List<ContractItem>();
}
