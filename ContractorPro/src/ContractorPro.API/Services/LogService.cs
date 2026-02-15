using System.Collections.Concurrent;

namespace ContractorPro.API.Services;

public class LogEntry
{
    public int Id { get; set; }
    public DateTime Timestamp { get; set; }
    public string Level { get; set; } = "Error";
    public string Source { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? StackTrace { get; set; }
    public string? RequestPath { get; set; }
    public string? RequestMethod { get; set; }
}

public interface ILogService
{
    void LogError(string source, string message, string? stackTrace = null, string? requestPath = null, string? requestMethod = null);
    void LogInfo(string source, string message);
    IEnumerable<LogEntry> GetLogs(int count = 100);
    void Clear();
}

public class InMemoryLogService : ILogService
{
    private readonly ConcurrentQueue<LogEntry> _logs = new();
    private int _idCounter = 0;
    private const int MaxLogs = 500;

    public void LogError(string source, string message, string? stackTrace = null, string? requestPath = null, string? requestMethod = null)
    {
        var entry = new LogEntry
        {
            Id = Interlocked.Increment(ref _idCounter),
            Timestamp = DateTime.UtcNow,
            Level = "Error",
            Source = source,
            Message = message,
            StackTrace = stackTrace,
            RequestPath = requestPath,
            RequestMethod = requestMethod
        };

        _logs.Enqueue(entry);

        // Keep only the last MaxLogs entries
        while (_logs.Count > MaxLogs && _logs.TryDequeue(out _)) { }
    }

    public void LogInfo(string source, string message)
    {
        var entry = new LogEntry
        {
            Id = Interlocked.Increment(ref _idCounter),
            Timestamp = DateTime.UtcNow,
            Level = "Info",
            Source = source,
            Message = message
        };

        _logs.Enqueue(entry);

        while (_logs.Count > MaxLogs && _logs.TryDequeue(out _)) { }
    }

    public IEnumerable<LogEntry> GetLogs(int count = 100)
    {
        return _logs.Reverse().Take(count).ToList();
    }

    public void Clear()
    {
        while (_logs.TryDequeue(out _)) { }
    }
}
