using Microsoft.AspNetCore.Mvc;
using ContractorPro.API.Services;

namespace ContractorPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LogsController : ControllerBase
{
    private readonly ILogService _logService;

    public LogsController(ILogService logService)
    {
        _logService = logService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<LogEntry>> GetLogs([FromQuery] int count = 100)
    {
        var logs = _logService.GetLogs(count);
        return Ok(logs);
    }

    [HttpGet("errors")]
    public ActionResult<IEnumerable<LogEntry>> GetErrors([FromQuery] int count = 50)
    {
        var logs = _logService.GetLogs(count * 2)
            .Where(l => l.Level == "Error")
            .Take(count);
        return Ok(logs);
    }

    [HttpDelete]
    public ActionResult Clear()
    {
        _logService.Clear();
        return Ok(new { message = "Logs cleared" });
    }
}
