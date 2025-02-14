import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PedidoComponent } from './components/pedido/pedido.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'pedidos', component: PedidoComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
