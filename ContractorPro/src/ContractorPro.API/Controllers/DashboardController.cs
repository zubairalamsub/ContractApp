using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContractorPro.Infrastructure.Data;

namespace ContractorPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardStats>> GetDashboardStats()
    {
        var contracts = await _context.Contracts.ToListAsync();
        var items = await _context.ContractItems.ToListAsync();

        var stats = new DashboardStats
        {
            TotalContracts = contracts.Count,
            ActiveContracts = contracts.Count(c => c.Status == "Active"),
            CompletedContracts = contracts.Count(c => c.Status == "Completed"),
            DraftContracts = contracts.Count(c => c.Status == "Draft"),
            TotalBudget = contracts.Sum(c => c.TotalBudget),
            TotalSpent = contracts.Sum(c => c.SpentAmount),
            TotalItems = items.Count,
            TotalSuppliers = await _context.Suppliers.CountAsync(),
            PendingDeliveries = items.Count(i => i.DeliveryStatus == "Pending" || i.DeliveryStatus == "Ordered"),
            RecentContracts = contracts
                .OrderByDescending(c => c.CreatedAt)
                .Take(5)
                .Select(c => new RecentContract
                {
                    Id = c.Id,
                    ContractNumber = c.ContractNumber,
                    TenderNumber = c.TenderNumber,
                    Title = c.Title,
                    Client = c.Client,
                    Status = c.Status,
                    TotalBudget = c.TotalBudget,
                    SpentAmount = c.SpentAmount,
                    Progress = c.TotalBudget > 0 ? (int)((c.SpentAmount / c.TotalBudget) * 100) : 0
                })
                .ToList()
        };

        return stats;
    }
}

public class DashboardStats
{
    public int TotalContracts { get; set; }
    public int ActiveContracts { get; set; }
    public int CompletedContracts { get; set; }
    public int DraftContracts { get; set; }
    public decimal TotalBudget { get; set; }
    public decimal TotalSpent { get; set; }
    public int TotalItems { get; set; }
    public int TotalSuppliers { get; set; }
    public int PendingDeliveries { get; set; }
    public List<RecentContract> RecentContracts { get; set; } = new();
}

public class RecentContract
{
    public int Id { get; set; }
    public string ContractNumber { get; set; } = string.Empty;
    public string? TenderNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Client { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal TotalBudget { get; set; }
    public decimal SpentAmount { get; set; }
    public int Progress { get; set; }
}
