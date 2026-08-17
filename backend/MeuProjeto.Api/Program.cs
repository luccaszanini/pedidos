using System.Text.Json;
using Azure.Messaging.ServiceBus;
using MeuProjeto.Shared;

var builder = WebApplication.CreateBuilder(args);

// Mude para usar try-catch ou comente a linha se quiser apenas simular o fluxo:
// var connectionString = "Endpoint=sb://exemplo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=fakekey=";
// builder.Services.AddSingleton(new ServiceBusClient(connectionString));

var app = builder.Build();

app.MapPost("/pedidos", async (PedidoRequest request) =>
{
    var evento = new MeuProjeto.Shared.PedidoCriadoEvento { Id = Guid.NewGuid(), Produto = request.Produto };
    
    // Simulação local funcionando perfeitamente para a apresentação
    Console.WriteLine($"[API] Pedido recebido e processado localmente: {request.Produto}");
    return Results.Accepted("Pedido processado com sucesso!");
});

app.Run();