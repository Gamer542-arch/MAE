var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\napp.MapGet("/", () => Results.Json(new { message = "Hello from {name}!" }));\napp.Run();\n
