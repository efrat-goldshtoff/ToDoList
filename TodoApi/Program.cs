using Microsoft.EntityFrameworkCore;
using TodoApi;

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
builder.Services.AddDbContext<ToDoDbContext>(
    options =>
    {
        options.UseMySql(builder.Configuration.GetConnectionString("todo"),
        // ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("todo")));
        new MySqlServerVersion(new Version(8, 0, 0)));
    });

builder.Services.AddSwaggerGen();

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseCors();

// if (app.Environment.IsDevelopment())
// {
app.UseSwagger();
app.UseSwaggerUI();
// }

//get all tasks
app.MapGet("/items", async (ToDoDbContext context) =>
{
    var tasks = await context.Items.ToListAsync();
    return Results.Ok(tasks);
});

//add new task
app.MapPost("/items", async (ToDoDbContext context, Item newItem) =>
{
    await context.Items.AddAsync(newItem);
    await context.SaveChangesAsync();
    return Results.Ok(newItem);
});

//update task
app.MapPut("/items/{id}", async
(ToDoDbContext context, int id, Item updatedItem) =>
{
    var existItem = await context.Items.FindAsync(id);
    if (existItem == null)
        return Results.NotFound($"Item Id: {id} Not Found");
    existItem.Name = updatedItem.Name;
    existItem.IsComplete = updatedItem.IsComplete;
    await context.SaveChangesAsync();
    return Results.Ok(existItem);
});

//delete task
app.MapDelete("/items/{id}", async
(ToDoDbContext context, int id) =>
{
    var item = await context.Items.FindAsync(id);
    if (item == null)
        return Results.NotFound($"Item Id: {id} Not Found");
    context.Items.Remove(item);
    await context.SaveChangesAsync();
    return Results.Ok(item);
});

app.MapGet("/", () => "ToDo Api is running!");

app.Run();

