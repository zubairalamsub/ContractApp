namespace ContractorPro.Domain.Entities;

public class Document
{
    public int Id { get; set; }
    public int ContractId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string StoragePath { get; set; } = string.Empty; // Path in Supabase storage
    public string? FileUrl { get; set; } // Public URL if available
    public long FileSize { get; set; } // Size in bytes
    public string ContentType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int UploadedById { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Contract? Contract { get; set; }
    public User? UploadedBy { get; set; }
}
