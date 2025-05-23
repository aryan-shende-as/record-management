using System.Net.Mail;
using System.Net;
using BulkEmail.Interfaces;
using BulkEmail.Services;

var builder = WebApplication.CreateBuilder(args);

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

builder.Services.AddHttpClient();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
