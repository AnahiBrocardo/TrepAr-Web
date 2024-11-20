import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiArgentinaService } from '../../../Servicios/apiDatosArgentina/api-argentina.service';
import { PerfilService } from '../../../Servicios/perfil/perfil.service';
import { RespuestaProvincias } from '../../../Interfaces/respuestaProvincias';
import { LocalidadesResponse } from '../../../Interfaces/localidadesRespuesta';
import { Localidad } from '../../../Interfaces/localidad';
import { Perfil } from '../../../Interfaces/perfil.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css'
})
export class EditarPerfilComponent implements OnInit{

  @Input()
  userId:string='';

perfil?:Perfil;
fb=inject(FormBuilder);
dataArgentina = inject(ApiArgentinaService); // Inyectar el servicio de países
perfilService= inject(PerfilService);
idPerfil?:string;

isPasswordVisible = false; // Controla la visibilidad de la contraseña

provincias: string[] = []; // Variable para almacenar los países
 ciudades: string[] = []; // Lista de ciudades
 selectedProvinciaId: string = ''; // Provincia seleccionada

ngOnInit(): void {
this.obtenerPerfil(this.userId);
this.cargarProvincias();
}

 
formularioActualizacionPerfil= this.fb.nonNullable.group({
  idUser:[''],
  username:['', [Validators.required,Validators.minLength(3), Validators.maxLength(20)]],
  descripcion: ['', [Validators.required]],
  provincia: ['', [Validators.required]],
  ciudad: ['', [Validators.required]],
  linkInstagram:['',[Validators.pattern(/^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+$/)]],
  linkLinkedIn: ['',[Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/)]],
  linkWeb: ['',[Validators.pattern(/^(https?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[a-zA-Z0-9#_-]*)*\/?$/)]],
  telefono: ['',[Validators.pattern(/^[+]?[0-9]{1,4}?[-.\s]?[0-9]{1,3}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}$/)]], 
  /*^[+]?[0-9]{1,4}?: Permite un prefijo de país opcional [-.\s]?: Permite guiones, puntos o espacios como separadores.
  [0-9]{1,3}: Permite uno a tres dígitos para la parte del número. */
  imagePerfil:['',[Validators.pattern(/^.*\.(jpg|jpeg|png|gif|bmp|webp)$/i)]]
})

obtenerPerfil(id: string) {
  this.perfilService.getPerfilByIdUser(this.userId).subscribe({
    next: (perfilArray: Perfil[]) => {
      if (perfilArray.length > 0) {
        this.perfil = perfilArray[0];
        this.idPerfil= this.perfil.id;

        // Asignar valores al formulario
        this.formularioActualizacionPerfil.patchValue({
          idUser: this.userId,
          username: this.perfil.userName,
          descripcion: this.perfil.descripcion,
          provincia: this.perfil.provincia,
          ciudad: this.perfil.ciudad,
          linkInstagram: this.perfil.linkInstagram,
          linkLinkedIn: this.perfil.linkLinkedIn,
          linkWeb: this.perfil.linkWeb,
          telefono: this.perfil.telefono,
          imagePerfil: this.perfil.imagePerfil
        });

        // Cargar ciudades para la provincia del perfil
        if (this.perfil.provincia) {
          this.dataArgentina.getProvinciaIdByNombre(this.perfil.provincia).subscribe({
            next: (idProvincia) => {
              if (idProvincia) {
                this.dataArgentina.getLocalidadesIdProvincia(idProvincia).subscribe({
                  next: (data: LocalidadesResponse) => {
                    this.ciudades = data.localidades.map((localidad: Localidad) => localidad.nombre).sort();

                    // Asegurarse de que el valor de la ciudad esté en la lista de opciones
                    if (!this.ciudades.includes(this.perfil!.ciudad)) {
                      this.formularioActualizacionPerfil.controls['ciudad'].reset(); // Resetear si no coincide
                    }
                  },
                  error: (err) => console.error('Error al cargar ciudades:', err),
                });
              }
            },
            error: (err) => console.error('Error al obtener ID de provincia:', err),
          });
        }
      }
    },
    error: (e) => console.log(e.message),
  });
}


cargarProvincias() {
  this.dataArgentina.getProvincias().subscribe({
    next: (data: RespuestaProvincias) => {
      this.provincias = data.provincias.map(provincia => provincia.nombre).sort();
    },
    error: (err) => {
      console.error('Error al cargar provincias:', err);
    }
  });
}

onProvinciaChange(event: Event): void {
  const provinciaSeleccionada = this.formularioActualizacionPerfil.get('provincia')?.value;

  if (provinciaSeleccionada) {
    this.dataArgentina.getProvinciaIdByNombre(provinciaSeleccionada).subscribe({
      next: (idProvincia) => {
        if (idProvincia) {
          console.log('ID de la provincia:', idProvincia);

          // Obtener los municipios pasando el ID de la provincia
          this.dataArgentina.getLocalidadesIdProvincia(idProvincia).subscribe({
            next: (data: LocalidadesResponse) => {
              this.ciudades = data.localidades.map((localidad:Localidad) => localidad.nombre).sort();
              this.formularioActualizacionPerfil.controls['ciudad'].reset(); // Resetear el campo de ciudad
            },
            error: (err) => {
              console.error('Error al cargar municipios:', err);
            },
          });
        } else {
          console.log('Provincia no encontrada');
        }
      },
      error: (err) => {
        console.error('Error al obtener el ID de la provincia:', err);
      },
    });
  }
}


validarFormularioPerfil(){
  if (this.formularioActualizacionPerfil.invalid) {
    return;
  }
  const formValue = this.formularioActualizacionPerfil.value;

  // Convertir el valor del formulario a un objeto User
  const perfilActualizado: Perfil = {
    idUser:'',
    userName:formValue.username ?? '',
    descripcion:formValue.descripcion ?? '',
    provincia: formValue.provincia ?? '',
    ciudad:formValue.ciudad ?? '',
    linkInstagram:formValue.linkInstagram ?? '',
    linkLinkedIn: formValue.linkLinkedIn ?? '',
    linkWeb: formValue.linkWeb ?? '',
    telefono: formValue.telefono ?? '',
    imagePerfil: formValue.imagePerfil ?? '',
    listaFavoritos:[]
  };

  const username = this.formularioActualizacionPerfil.get('username')?.value; //se obtiene el username del formulario

  // Verificar si el username ya está registrado
  this.perfilService.getPerfiles().subscribe({
    next: (profiles: Perfil[]) => {
      if(username){
      if (this.usernameExists(profiles, username)) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El nombre de usuario ya está en uso',
        });
      } else {
        this.guardarCambiosPerfil(perfilActualizado); // Guardar usuario y perfil
      }
    }
    },
    error: (error) => {
      console.error('Error al verificar el username', error);
    },
  });
}

// Método que verifica si el username ya existe en el array de perfiles
private usernameExists(perfiles: Perfil[], username: string): boolean {
  return perfiles.some(perfil => perfil.userName === username && perfil.idUser !== this.userId);
}


guardarCambiosPerfil(perfilActualizado:Perfil){
  perfilActualizado.idUser=this.userId;
  if(this.idPerfil){
this.perfilService.actualizarPerfilByIdUser(this.idPerfil, perfilActualizado).subscribe({
  next:(perfil: Perfil)=>{
    Swal.fire("Perfil actualizado correctamente");
    location.reload();
  },
  error: (e:Error)=>{
    console.log(e);
  }
})
}
}
}
