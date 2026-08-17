namespace MeuProjeto.Shared;

public class PedidoRequest
{
    public string Produto { get; set; }
}

public class PedidoCriadoEvento
{
    public Guid Id { get; set; }
    public string Produto { get; set; }
}