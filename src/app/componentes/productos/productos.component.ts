import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoServiceService } from '../../Servicios/productos/productos-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoInterface, UsuariosxProductos } from '../../Interfaces/producto-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  
  activated= inject(ActivatedRoute);
  userId: string='';

  ngOnInit(): void {
   this.activated.paramMap.subscribe({
    next:(param)=>{
      const id= param.get('id');
      if(id){
        this.userId=id;
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
        nombre: ['', Validators.required],
        categoria: ['', Validators.required],
        descripcion: ['', Validators.required],
        precio: ['', Validators.required]
      }
    )
    
    @Output()
  emitirProducto: EventEmitter<UsuariosxProductos> = new EventEmitter(); 
 
  addProducto()
  {
    if(this.formulario.invalid) return; 

    const nproducto = this.formulario.getRawValue();

    const nuevoProducto: ProductoInterface = {
    nombre: nproducto.nombre, 
    categoria: nproducto.categoria,
    descripcion: nproducto.descripcion,
    precio: nproducto.precio,
    deletedAt: false
    }

    const usuariosxproductos: UsuariosxProductos = {
      id: this.userId, 
      productoInterface: [nuevoProducto]
    }

    this.addProductoDB(usuariosxproductos)
    this.emitirProducto.emit(usuariosxproductos); 
  }

  addProductoDB (producto: UsuariosxProductos){
    this.productoService.postProductos(producto).subscribe(
      {
        next: (producto: UsuariosxProductos) => {
          console.log(producto); 
          alert('Tarea Guardada')
        },
        error: (e: Error) => {
          console.log(e.message); 
        }
      }
    )
  }
}
