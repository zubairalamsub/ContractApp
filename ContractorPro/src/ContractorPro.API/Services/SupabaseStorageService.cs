using System.Net.Http.Headers;

namespace ContractorPro.API.Services;

public interface ISupabaseStorageService
{
    Task<(string storagePath, string publicUrl)> UploadFileAsync(Stream fileStream, string fileName, string contentType, string folder);
    Task<bool> DeleteFileAsync(string storagePath);
    string GetPublicUrl(string storagePath);
}

public class SupabaseStorageService : ISupabaseStorageService
{
    private readonly HttpClient _httpClient;
    private readonly string _supabaseUrl;
    private readonly string _supabaseKey;
    private readonly string _bucketName;
    private readonly ILogger<SupabaseStorageService> _logger;

    public SupabaseStorageService(IConfiguration configuration, ILogger<SupabaseStorageService> logger)
    {
        _logger = logger;
        _supabaseUrl = configuration["Supabase:Url"] ?? throw new ArgumentNullException("Supabase:Url not configured");
        _supabaseKey = configuration["Supabase:Key"] ?? throw new ArgumentNullException("Supabase:Key not configured");
        _bucketName = configuration["Supabase:BucketName"] ?? "documents";

        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _supabaseKey);
        _httpClient.DefaultRequestHeaders.Add("apikey", _supabaseKey);
    }

    public async Task<(string storagePath, string publicUrl)> UploadFileAsync(Stream fileStream, string fileName, string contentType, string folder)
    {
        try
        {
            // Generate unique file name
            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
            var storagePath = string.IsNullOrEmpty(folder) ? uniqueFileName : $"{folder}/{uniqueFileName}";

            // Prepare the upload URL
            var uploadUrl = $"{_supabaseUrl}/storage/v1/object/{_bucketName}/{storagePath}";

            using var content = new StreamContent(fileStream);
            content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

            var response = await _httpClient.PostAsync(uploadUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Supabase upload failed: {Error}", error);
                throw new Exception($"Failed to upload file: {error}");
            }

            var publicUrl = GetPublicUrl(storagePath);
            return (storagePath, publicUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file to Supabase");
            throw;
        }
    }

    public async Task<bool> DeleteFileAsync(string storagePath)
    {
        try
        {
            var deleteUrl = $"{_supabaseUrl}/storage/v1/object/{_bucketName}/{storagePath}";

            var response = await _httpClient.DeleteAsync(deleteUrl);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Supabase delete failed: {Error}", error);
                return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file from Supabase");
            return false;
        }
    }

    public string GetPublicUrl(string storagePath)
    {
        return $"{_supabaseUrl}/storage/v1/object/public/{_bucketName}/{storagePath}";
    }
}
