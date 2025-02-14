using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ApiZ.Models
{
    public class PedidoDetalle
    {
        [Key]
        public int Id { get; set; }
        public int? PedidoId { get; set; }

        [ForeignKey("PedidoId")]
        [JsonIgnore]
        public Pedido? Pedido { get; set; }

        public string Producto { get; set; }
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }
    }
}
