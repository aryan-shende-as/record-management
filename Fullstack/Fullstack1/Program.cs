using FluentValidation;
using FluentValidation.AspNetCore;
using Fullstack1;
using Fullstack1.Application.Validators;
using Fullstack1.Domain.Entities;
using Fullstack1.Infrastructure;
using Fullstack1.Middlewares;
using Fullstack1.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Serilog;
using System;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


// JWT Token
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {

            ValidateIssuer = true,
            ValidIssuer = "Fullstack1",
            ValidateAudience = true,
            ValidAudience = "Fullstack1",
            ValidateLifetime = true,
            //ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("yourSuperSecretKeyThatIsAtLeast32Chars!")),
            RoleClaimType = ClaimTypes.Role  // make sure role claim type is configured here

        };
    });


// Localization
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] { "en", "hi", "fr", "es", "ja" }
        .Select(c => new System.Globalization.CultureInfo(c))
        .ToList();

    options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture("en");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});



// Database Connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("EmployeeAppCon")));

// Twilio Settings
builder.Services.Configure<TwilioSettings>(builder.Configuration.GetSection("Twilio"));
builder.Services.AddSingleton<ITwilioService, TwilioService>();


// FluentValidation
builder.Services.AddControllers().AddFluentValidation();
builder.Services.AddScoped<IValidator<Employee>, EmployeeValidator>();
builder.Services.AddScoped<IValidator<Department>, DepartmentValidator>();

// OTP
builder.Services.AddValidatorsFromAssemblyContaining<OtpRequestValidator>();

var smtpSettings = builder.Configuration.GetSection("SmtpSettings");
builder.Services
    .AddFluentEmail(smtpSettings["FromEmail"], smtpSettings["FromName"])
    .AddRazorRenderer()
    .AddSmtpSender(new SmtpClient(smtpSettings["Host"])
    {
        Port = int.Parse(smtpSettings["Port"]),
        Credentials = new NetworkCredential(smtpSettings["User"], smtpSettings["Pass"]),
        EnableSsl = true
    });


// Serilog
//// Load Serilog from appsettings.json
//Log.Logger = new LoggerConfiguration()
//    .ReadFrom.Configuration(builder.Configuration)
//    .Enrich.FromLogContext()
//    .WriteTo.Console()
//    .CreateLogger();

//// replace default logger with serilog
//builder.Host.UseSerilog();

// Blacklisting a Token 
builder.Services.AddSingleton<ITokenBlacklistService, InMemoryTokenBlacklistService>();
builder.Services.AddAuthorization();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// JSON Serializer 
builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
    .AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver
    = new DefaultContractResolver());

// Storing Otp in Temp memory
builder.Services.AddSingleton<IOtpStorage, InMemoryOtpStorage>();

var app = builder.Build();


// Seeding here
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await DbSeeder.SeedAttendanceAsync(context);
}



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// images files se upload krne k liye ^^
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Photos")),
    RequestPath = "/Photos"
});

app.UseStaticFiles();
app.UseRequestLocalization();
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseMiddleware<TokenBlacklistMiddleware>();
app.UseAuthorization();
app.MapControllers();
app.Run();





