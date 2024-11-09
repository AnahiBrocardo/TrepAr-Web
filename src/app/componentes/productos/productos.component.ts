import { Component } from '@angular/core';
import { ProductosPageComponent } from '../../pages/productos-page/productos-page.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ProductosPageComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

}
