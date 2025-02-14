import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private API_URL = "https://localhost:7161/api";
  
  constructor(private http: HttpClient) {}

  // 🔹 Obtener Token de Autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // 🔹 Login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, { username, password });
  }

  // 🔹 Obtener Pedidos
  getPedidos(): Observable<any> {
    return this.http.get(`${this.API_URL}/pedidos`, { headers: this.getAuthHeaders() });
  }

  // 🔹 Agregar Pedido
  agregarPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.API_URL}/pedidos`, pedido, { headers: this.getAuthHeaders() });
  }

  // 🔹 Eliminar Pedido
  eliminarPedido(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/pedidos/${id}`, { headers: this.getAuthHeaders() });
  }
}
