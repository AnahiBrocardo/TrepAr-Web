import { Component} from '@angular/core';
import { ProductosComponent } from '../../../componentes/productos/productos.component';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [ProductosComponent],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent{
  
}
