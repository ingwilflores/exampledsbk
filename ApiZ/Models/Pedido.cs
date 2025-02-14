using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ApiZ.Models
{
    public class Pedido
    {
        [Key]
        public int Id { get; set; }
        public string Cliente { get; set; }
        public DateTime Fecha { get; set; }

        public List<PedidoDetalle> Detalles { get; set; } = new List<PedidoDetalle>();
    }
}
