namespace MeuProjeto.Worker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("[Worker] Serviço rodando e escutando localmente!");
        
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("[Worker] Ciclo de processamento ativo...");
            await Task.Delay(5000, stoppingToken);
        }
    }
}