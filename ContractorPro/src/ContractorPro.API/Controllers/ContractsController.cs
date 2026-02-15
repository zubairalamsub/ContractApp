using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContractorPro.Domain.Entities;
using ContractorPro.Infrastructure.Data;

namespace ContractorPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ContractsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Contract>>> GetContracts()
    {
        return await _context.Contracts
            .Include(c => c.Items)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Contract>> GetContract(int id)
    {
        var contract = await _context.Contracts
            .Include(c => c.Items)
                .ThenInclude(i => i.Category)
            .Include(c => c.Items)
                .ThenInclude(i => i.Supplier)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (contract == null)
            return NotFound();

        return contract;
    }

    [HttpPost]
    public async Task<ActionResult<Contract>> CreateContract(Contract contract)
    {
        contract.CreatedAt = DateTime.UtcNow;
        contract.UpdatedAt = DateTime.UtcNow;

        _context.Contracts.Add(contract);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetContract), new { id = contract.Id }, contract);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateContract(int id, Contract contract)
    {
        if (id != contract.Id)
            return BadRequest();

        contract.UpdatedAt = DateTime.UtcNow;
        _context.Entry(contract).State = EntityState.Modified;
        _context.Entry(contract).Property(x => x.CreatedAt).IsModified = false;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Contracts.AnyAsync(c => c.Id == id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContract(int id)
    {
        var contract = await _context.Contracts.FindAsync(id);
        if (contract == null)
            return NotFound();

        _context.Contracts.Remove(contract);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Contract Items endpoints
    [HttpGet("{id}/items")]
    public async Task<ActionResult<IEnumerable<ContractItem>>> GetContractItems(int id)
    {
        var items = await _context.ContractItems
            .Include(i => i.Category)
            .Include(i => i.Supplier)
            .Where(i => i.ContractId == id)
            .ToListAsync();

        return items;
    }

    [HttpPost("{id}/items")]
    public async Task<ActionResult<ContractItem>> AddContractItem(int id, ContractItem item)
    {
        if (!await _context.Contracts.AnyAsync(c => c.Id == id))
            return NotFound("Contract not found");

        item.ContractId = id;
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;

        _context.ContractItems.Add(item);
        await _context.SaveChangesAsync();

        // Update contract spent amount
        await UpdateContractSpentAmount(id);

        return CreatedAtAction(nameof(GetContractItems), new { id }, item);
    }

    [HttpPut("{contractId}/items/{itemId}")]
    public async Task<IActionResult> UpdateContractItem(int contractId, int itemId, ContractItem item)
    {
        if (itemId != item.Id || contractId != item.ContractId)
            return BadRequest();

        item.UpdatedAt = DateTime.UtcNow;
        _context.Entry(item).State = EntityState.Modified;
        _context.Entry(item).Property(x => x.CreatedAt).IsModified = false;

        try
        {
            await _context.SaveChangesAsync();
            await UpdateContractSpentAmount(contractId);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.ContractItems.AnyAsync(i => i.Id == itemId))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{contractId}/items/{itemId}")]
    public async Task<IActionResult> DeleteContractItem(int contractId, int itemId)
    {
        var item = await _context.ContractItems.FindAsync(itemId);
        if (item == null || item.ContractId != contractId)
            return NotFound();

        _context.ContractItems.Remove(item);
        await _context.SaveChangesAsync();
        await UpdateContractSpentAmount(contractId);

        return NoContent();
    }

    private async Task UpdateContractSpentAmount(int contractId)
    {
        var contract = await _context.Contracts.FindAsync(contractId);
        if (contract != null)
        {
            contract.SpentAmount = await _context.ContractItems
                .Where(i => i.ContractId == contractId)
                .SumAsync(i => i.Quantity * i.UnitPrice);
            await _context.SaveChangesAsync();
        }
    }
}
