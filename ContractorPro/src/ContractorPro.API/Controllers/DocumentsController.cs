using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ContractorPro.Domain.Entities;
using ContractorPro.Infrastructure.Data;
using ContractorPro.API.Services;

namespace ContractorPro.API.Controllers;

[ApiController]
[Route("api/contracts/{contractId}/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ISupabaseStorageService _storageService;
    private readonly ILogger<DocumentsController> _logger;

    public DocumentsController(
        ApplicationDbContext context,
        ISupabaseStorageService storageService,
        ILogger<DocumentsController> logger)
    {
        _context = context;
        _storageService = storageService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetDocuments(int contractId)
    {
        var contract = await _context.Contracts.FindAsync(contractId);
        if (contract == null)
            return NotFound("Contract not found");

        var documents = await _context.Documents
            .Where(d => d.ContractId == contractId)
            .Include(d => d.UploadedBy)
            .OrderByDescending(d => d.UploadedAt)
            .Select(d => new DocumentDto
            {
                Id = d.Id,
                ContractId = d.ContractId,
                FileName = d.FileName,
                OriginalFileName = d.OriginalFileName,
                FileUrl = d.FileUrl,
                FileSize = d.FileSize,
                ContentType = d.ContentType,
                Description = d.Description,
                UploadedById = d.UploadedById,
                UploadedByName = d.UploadedBy != null ? d.UploadedBy.FullName : null,
                UploadedAt = d.UploadedAt
            })
            .ToListAsync();

        return Ok(documents);
    }

    [HttpPost]
    public async Task<ActionResult<DocumentDto>> UploadDocument(int contractId, IFormFile file, [FromForm] string? description)
    {
        var contract = await _context.Contracts.FindAsync(contractId);
        if (contract == null)
            return NotFound("Contract not found");

        if (file == null || file.Length == 0)
            return BadRequest("No file provided");

        // Validate file size (max 10MB)
        if (file.Length > 10 * 1024 * 1024)
            return BadRequest("File size exceeds 10MB limit");

        // Get current user ID
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            // For development/testing, use admin user
            userId = 1;
        }

        try
        {
            // Upload to Supabase
            var folder = $"contracts/{contractId}";
            using var stream = file.OpenReadStream();
            var (storagePath, publicUrl) = await _storageService.UploadFileAsync(
                stream,
                file.FileName,
                file.ContentType,
                folder);

            // Save document record
            var document = new Document
            {
                ContractId = contractId,
                FileName = Path.GetFileName(storagePath),
                OriginalFileName = file.FileName,
                StoragePath = storagePath,
                FileUrl = publicUrl,
                FileSize = file.Length,
                ContentType = file.ContentType,
                Description = description,
                UploadedById = userId,
                UploadedAt = DateTime.UtcNow
            };

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            // Load the uploaded by user
            var user = await _context.Users.FindAsync(userId);

            return CreatedAtAction(nameof(GetDocuments), new { contractId }, new DocumentDto
            {
                Id = document.Id,
                ContractId = document.ContractId,
                FileName = document.FileName,
                OriginalFileName = document.OriginalFileName,
                FileUrl = document.FileUrl,
                FileSize = document.FileSize,
                ContentType = document.ContentType,
                Description = document.Description,
                UploadedById = document.UploadedById,
                UploadedByName = user?.FullName,
                UploadedAt = document.UploadedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading document for contract {ContractId}", contractId);
            return StatusCode(500, "Failed to upload document");
        }
    }

    [HttpDelete("{documentId}")]
    public async Task<IActionResult> DeleteDocument(int contractId, int documentId)
    {
        var document = await _context.Documents
            .FirstOrDefaultAsync(d => d.Id == documentId && d.ContractId == contractId);

        if (document == null)
            return NotFound("Document not found");

        try
        {
            // Delete from Supabase
            await _storageService.DeleteFileAsync(document.StoragePath);

            // Delete from database
            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting document {DocumentId}", documentId);
            return StatusCode(500, "Failed to delete document");
        }
    }
}

public class DocumentDto
{
    public int Id { get; set; }
    public int ContractId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string? FileUrl { get; set; }
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int UploadedById { get; set; }
    public string? UploadedByName { get; set; }
    public DateTime UploadedAt { get; set; }
}
