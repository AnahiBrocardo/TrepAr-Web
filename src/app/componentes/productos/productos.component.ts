import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoServiceService } from '../../Servicios/productos/productos-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoInterface, UsuariosxProductos } from '../../Interfaces/producto-interface';
import { CommonModule } from '@angular/common';
import { ListarProductoComponent } from './listar-producto/listar-producto.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ListarProductoComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  
  activated= inject(ActivatedRoute);
  userId: string='';
  router= inject(Router);

  @Output() emitirProducto: EventEmitter<ProductoInterface> = new EventEmitter();

  ngOnInit(): void {
   this.activated.paramMap.subscribe({
    next:(param)=>{
      const id= param.get('id');
      if(id){
        this.userId=id;
        this.formulario.patchValue({ idUser: this.userId });  // Actualiza el idUser en el formulario
      }
    }
   })
  }

  fb= inject(FormBuilder)
  productoService= inject(ProductoServiceService)

  /*Contenidos de la barra desplegable */
  categorias: string[] = ['Electrónica', 'Ropa', 'Hogar', 'Libros', 'Belleza', 'Juguetes', 'Deportes', 'Automotores', 'Alimentos', 'Mascotas', 'Otro']; 

    /*No va a aceptar nincun campo que sea nulo con el nonnull.. */
    formulario = this.fb.nonNullable.group(
      {
        idUser: '',
        nombre: ['', Validators.required],
        categoria: ['', Validators.required],
        descripcion: ['', Validators.required],
        precio: ['', Validators.required],
        deletedAt: false
      }
    )
    
  addProducto()
  {
   
    if(this.formulario.invalid) return; 

    const nuevoProducto = this.formulario.getRawValue()
    this.addProductoDB(nuevoProducto)
    this.emitirProducto.emit(nuevoProducto)

     
  };

  addProductoDB (producto: ProductoInterface){
    this.productoService.postProductos(producto).subscribe(
      {
        next: (producto: ProductoInterface) => {
          console.log(producto); 
          Swal.fire("Producto Guardado");
          location.reload();

        },
        error: (e: Error) => {
          console.log(e.message); 
        }
      }
    )
  }
  
}