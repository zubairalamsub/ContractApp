namespace ContractorPro.Domain.Entities;

public class ContractItem
{
    public int Id { get; set; }
    public int ContractId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public int Quantity { get; set; }
    public int UsedQuantity { get; set; }
    public string Unit { get; set; } = "pcs"; // pcs, m, kg, etc.
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice => Quantity * UnitPrice;
    public string DeliveryStatus { get; set; } = "Pending"; // Pending, Ordered, Delivered, Installed
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Contract? Contract { get; set; }
    public Category? Category { get; set; }
    public Supplier? Supplier { get; set; }
}
