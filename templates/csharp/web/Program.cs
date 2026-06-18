using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors();
app.UseExceptionHandler(exceptionHandler =>
{
    exceptionHandler.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "An unexpected error occurred" });
    });
});

var items = new ConcurrentDictionary<Guid, Item>();
items.TryAdd(Guid.NewGuid(), new Item("Sample Item", "A starter item for {name}", 19.99));

var itemsApi = app.MapGroup("/items");

itemsApi.MapGet("/", () => Results.Ok(items.Values));

itemsApi.MapGet("/{id:guid}", (Guid id) =>
{
    if (!items.TryGetValue(id, out var item))
        return Results.NotFound(new { error = "Item not found" });
    return Results.Ok(item);
});

itemsApi.MapPost("/", (CreateItemRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
        return Results.BadRequest(new { error = "Name is required" });
    if (request.Price < 0)
        return Results.BadRequest(new { error = "Price cannot be negative" });

    var item = new Item(request.Name, request.Description, request.Price);
    items.TryAdd(item.Id, item);
    return Results.Created($"/items/{item.Id}", item);
});

itemsApi.MapDelete("/{id:guid}", (Guid id) =>
{
    if (!items.TryRemove(id, out _))
        return Results.NotFound(new { error = "Item not found" });
    return Results.NoContent();
});

app.MapGet("/", () => Results.Ok(new { service = "{name} API", version = "1.0.0" }));

app.Run();

public record Item
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; init; }
    public string Description { get; init; }
    public double Price { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

    public Item(string name, string description, double price)
    {
        Name = name;
        Description = description;
        Price = price;
    }
}

public record CreateItemRequest(string Name, string Description, double Price);
