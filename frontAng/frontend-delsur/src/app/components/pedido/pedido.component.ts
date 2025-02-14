import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedido',
  standalone: false,
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss'
})
export class PedidoComponent implements OnInit {
  pedidos: any[] = [];
  cliente: string = '';
  detalles: any[] = [{ producto: '', cantidad: 1, precio: 0 }];
  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.obtenerPedidos();
  }

  obtenerPedidos() {
    this.pedidoService.getPedidos().subscribe(data => {
      console.log("Pedidos recibidos (antes de transformación):", data);
  
      // Extraer `$values` si existen en la respuesta (para evitar estructuras anidadas innecesarias)
      const pedidosArray = data.$values ? data.$values : data;
  
      // Transformar cada pedido, asegurando que los detalles sean un array
      this.pedidos = pedidosArray.map((pedido: any) => ({
        ...pedido,
        detalles: Array.isArray(pedido.detalles) ? pedido.detalles : (pedido.detalles?.$values || []), // Asegurar que detalles no sea null
        mostrarDetalles: false
      }));
  
      console.log("Pedidos después de transformación:", this.pedidos);
    });
  }
  
  

  toggleDetalles(pedido: any) {
    pedido.mostrarDetalles = !pedido.mostrarDetalles;
  }

  agregarDetalle() {
    this.detalles.push({ producto: '', cantidad: 1, precio: 0 });
  }

  agregarPedido() {
    const nuevoPedido = {
      cliente: this.cliente,
      fecha: new Date().toISOString(),
      detalles: this.detalles
    };

    this.pedidoService.agregarPedido(nuevoPedido).subscribe(() => {
      this.obtenerPedidos();
      this.cliente = '';
      this.detalles = [{ producto: '', cantidad: 1, precio: 0 }];
    });
  }

  eliminarPedido(id: number) {
    if (confirm("¿Desea eliminar este pedido?")) {
      this.pedidoService.eliminarPedido(id).subscribe(() => {
        this.obtenerPedidos();
      });
    }
  }
}