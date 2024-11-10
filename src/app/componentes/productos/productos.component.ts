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
        precio: ['', Validators.required],
        deleteAt: false
      }
    )
    
  addProducto()
  {
   
    if(this.formulario.invalid) return; 

    const nproducto = this.formulario.getRawValue();

    const nuevoProducto: ProductoInterface = {
    id: this.generarId(),
    nombre: nproducto.nombre, 
    categoria: nproducto.categoria,
    descripcion: nproducto.descripcion,
    precio: nproducto.precio,
    deletedAt: false
    }; 

    // Buscar si ya existe un objeto UsuariosxProductos con el mismo userId
    // Verificar si el usuario ya tiene productos
    this.productoService.obtenerUsuarioPorId(this.userId).subscribe(usuarios => {
      if (usuarios.length > 0) {
        // Si el usuario ya tiene productos, agregar el nuevo al final del arreglo
        const usuarioExistente = usuarios[0];
        usuarioExistente.productoInterface.push(nuevoProducto); // Agregar producto al final del arreglo

        // Actualizar usuario con el nuevo producto
        this.productoService.putProductos(usuarioExistente).subscribe((usuarioActualizado) => {
          console.log('Usuario actualizado con nuevo producto', usuarioActualizado);
          this.formulario.reset();
        });
      } else {
        // Si el usuario no existe, crear uno nuevo con el producto
        const nuevoUsuario = {
          id: this.userId,
          productoInterface: [nuevoProducto] // El primer producto se agrega aquí
        };

        this.productoService.postProductos(nuevoUsuario).subscribe((usuarioCreado) => {
          console.log('Nuevo usuario creado con el primer producto', usuarioCreado);
          this.formulario.reset();
        });
      }
    } )
  };

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

  generarId(): string {
    return Math.random().toString(36).substr(2, Math.floor(Math.random() * 4) + 2);
  }
  
}