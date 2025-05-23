using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using MapService.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MapService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MapController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<MapController> _logger;

        public MapController(HttpClient httpClient, IConfiguration config, ILogger<MapController> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;

            // Add required to avoid 403 error from nominatim
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("MyApp/1.0 (aryan.shende@sarvaha.com)");
        }

        [HttpGet("location/{departmentId}")]
        public async Task<IActionResult> GetDepartmentLocation(int departmentId)
        {
            _logger.LogInformation("Fetching department info for ID: {DepartmentId}", departmentId);

            var response = await _httpClient.GetAsync($"http://localhost:5000/api/department/{departmentId}");
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Department not found for ID: {DepartmentId}", departmentId);
                return NotFound(new { message = "Department not found" });
            }

            var dept = await response.Content.ReadFromJsonAsync<Department>();
            if (dept == null)
            {
                _logger.LogWarning("No department data returned for ID: {DepartmentId}", departmentId);
                return NotFound(new { message = "Invalid department data" });
            }

            _logger.LogInformation("Department: {DepartmentName}, Location: {Location}", dept.DepartmentName, dept.Location);

            var encodedLocation = Uri.EscapeDataString(dept.Location);
            var url = $"https://nominatim.openstreetmap.org/search?format=json&q={encodedLocation}";

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var geoResponse = await _httpClient.GetFromJsonAsync<List<GeoResult>>(url, options);
            if (geoResponse == null || !geoResponse.Any())
            {
                _logger.LogWarning("Geocoding failed for location: {Location}", dept.Location);
                return NotFound(new { message = "Location not found" });
            }

            var coords = geoResponse.First();
            _logger.LogInformation("Coordinates: Lat={Lat}, Lon={Lon}", coords.Lat, coords.Lon);

            return Ok(new
            {
                departmentName = dept.DepartmentName,
                location = dept.Location,
                lat = coords.Lat,
                lon = coords.Lon
            });
        }

        // ✅ GeoResult model
        public class GeoResult
        {
            [JsonPropertyName("place_id")]
            public long PlaceId { get; set; }

            [JsonPropertyName("lat")]
            [JsonConverter(typeof(StringConverter))]
            public string Lat { get; set; }

            [JsonPropertyName("lon")]
            [JsonConverter(typeof(StringConverter))]
            public string Lon { get; set; }

            [JsonPropertyName("display_name")]
            public string DisplayName { get; set; }

            [JsonPropertyName("type")]
            public string Type { get; set; }

            [JsonPropertyName("importance")]
            public double? Importance { get; set; }
        }

        // Handles both string and number types
        public class StringConverter : JsonConverter<string>
        {
            public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                return reader.TokenType switch
                {
                    JsonTokenType.String => reader.GetString(),
                    JsonTokenType.Number => reader.GetDouble().ToString(CultureInfo.InvariantCulture),
                    _ => throw new JsonException($"Unexpected token parsing string. Token: {reader.TokenType}")
                };
            }

            public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
            {
                writer.WriteStringValue(value);
            }
        }
    }
}

