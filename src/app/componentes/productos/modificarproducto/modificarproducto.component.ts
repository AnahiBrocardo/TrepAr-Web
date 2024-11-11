import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import { ProductoInterface } from '../../../Interfaces/producto-interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-modificarproducto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modificarproducto.component.html',
  styleUrl: './modificarproducto.component.css'
})
export class ModificarproductoComponent {
  activated = inject(ActivatedRoute);
  productoServices = inject(ProductoServiceService);
  fb = inject(FormBuilder);
  
  userId: string = '';
  productoId: string = '';
  producto: ProductoInterface | null = null;

  // Formulario reactivo
  formulario = this.fb.group({
    nombre: ['', Validators.required],
    categoria: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', Validators.required],
    deletedAt: [false]
  });

  ngOnInit(): void {
    this.activated.paramMap.subscribe({
      next: (param) => {
        this.productoId = param.get('id')!;
        this.userId = param.get('userId')!;
        this.obtenerProducto(this.productoId);
      }
    });
  }

  // Obtener el producto que se desea editar
  obtenerProducto(id: string) {
    this.productoServices.getProductoById(id).subscribe({
      next: (producto: ProductoInterface) => {
        this.producto = producto;
        this.formulario.patchValue({
          nombre: producto.nombre,
          categoria: producto.categoria,
          descripcion: producto.descripcion,
          precio: producto.precio,
          deletedAt: producto.deletedAt
        });
      },
      error: (e) => {
        console.log(e.message);
      }
    });
  }

  // Método para actualizar un producto
  actualizarProducto() {
    if (this.formulario.invalid) return;

    const productoActualizado: ProductoInterface = {
      id: this.productoId,
      idUser: this.userId,
      nombre: this.formulario.value.nombre || '',  // Si es null o undefined, usa una cadena vacía
      categoria: this.formulario.value.categoria || '',
      descripcion: this.formulario.value.descripcion || '',
      precio: this.formulario.value.precio || '',
      deletedAt: this.formulario.value.deletedAt || false
    };

    this.productoServices.putProductos(this.productoId, productoActualizado).subscribe({
      next: (producto: ProductoInterface) => {
        console.log('Producto actualizado:', producto);
        alert('Producto actualizado correctamente');
      },
      error: (e) => {
        console.log(e.message);
        alert('Error al actualizar el producto');
      }
    });
  }
}

