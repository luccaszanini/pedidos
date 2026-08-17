using MeuProjeto.Worker;

var builder = Host.CreateApplicationBuilder(args);

// Serviço configurado em background (pronto para receber o Service Bus)
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();