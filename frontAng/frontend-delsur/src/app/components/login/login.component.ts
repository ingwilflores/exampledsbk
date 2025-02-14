import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = ''; 

  constructor(private pedidoService: PedidoService, private router: Router) {}

  login() {
    this.pedidoService.login(this.username, this.password).subscribe(
      data => {
        localStorage.setItem('token', data.token);
        this.router.navigate(['/pedidos']); 
      },
      error => {
        this.errorMessage = "Usuario o contraseña incorrectos.";
      }
    );
  }
}