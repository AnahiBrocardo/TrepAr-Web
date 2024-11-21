import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoInterface } from '../../../Interfaces/producto-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoServiceService } from '../../../Servicios/productos/productos-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-producto-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agregar-producto-perfil.component.html',
  styleUrl: './agregar-producto-perfil.component.css'
})
export class AgregarProductoPerfilComponent implements OnInit{

  @Input() 
  userId!: string; // Declarar explícitamente la propiedad
  
  ngOnInit(): void {
    this.formulario.patchValue({ idUser: this.userId });
  }

  activated= inject(ActivatedRoute);
  router= inject(Router);

  
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
        deletedAt: false,
        privado: [true, Validators.required],
        imagen:['']
      }
    )
    
  addProducto()
  {
   
    if(this.formulario.invalid) return; 

    const nuevoProducto = this.formulario.getRawValue();
    this.addProductoDB(nuevoProducto)

     
  };

  addProductoDB (producto: ProductoInterface){
    this.productoService.postProductos(producto).subscribe(
      {
        next: (producto: ProductoInterface) => {
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
