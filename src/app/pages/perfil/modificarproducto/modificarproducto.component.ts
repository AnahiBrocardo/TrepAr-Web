import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import { ProductoInterface } from '../../../Interfaces/producto-interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificarproducto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modificarproducto.component.html',
  styleUrl: './modificarproducto.component.css'
})


export class ModificarproductoComponent implements OnInit{
  @Input() 
  productoId!: string; 

  @Input() 
  idUser!: string;
  
  activated = inject(ActivatedRoute);
  productoServices = inject(ProductoServiceService);
  fb = inject(FormBuilder);


  producto: ProductoInterface | null = null;

  // Formulario reactivo
  formulario = this.fb.group({
    idUser:[''],
    nombre: ['', Validators.required],
    categoria: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', Validators.required],
    deletedAt: [false],
    privado: [false],
    imagen: ['']
  });


 
  
  ngOnInit(): void {
    this.formulario.patchValue({ idUser: this.idUser });
    this.obtenerProducto(this.productoId);
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
          privado: producto.privado,
          imagen: producto.imagen
          
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
      idUser: this.idUser,
      nombre: this.formulario.value.nombre || '',  // Si es null o undefined, usa una cadena vacía
      categoria: this.formulario.value.categoria || '',
      descripcion: this.formulario.value.descripcion || '',
      precio: this.formulario.value.precio || '',
      deletedAt:false,
      privado: this.formulario.value.privado || false,
      imagen: this.formulario.value.imagen || ''
    };

    this.productoServices.putProductos(this.productoId, productoActualizado).subscribe({
      next: (producto: ProductoInterface) => {
        console.log('Producto actualizado:', producto);
        Swal.fire("Producto actualizado correctamente");
        location.reload();
      },
      error: (e) => {
        console.log(e.message);
        alert('Error al actualizar el producto');
      }
    });
  }
}

