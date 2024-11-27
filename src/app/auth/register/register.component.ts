
import { Perfil } from './../../Interfaces/perfil.interface';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../Servicios/usuario/user.service';
import { User } from '../../Interfaces/user.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PerfilService } from '../../Servicios/perfil/perfil.service';
import { ApiArgentinaService } from '../../Servicios/apiDatosArgentina/api-argentina.service';
import { RespuestaProvincias } from '../../Interfaces/respuestaProvincias';
import { LocalidadesResponse } from '../../Interfaces/localidadesRespuesta';
import { Localidad } from '../../Interfaces/localidad';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  ngOnInit(): void {
    this.cargarProvincias(); // se llama al servicio para cargar los países
  }
 fb= inject(FormBuilder);
 router= inject(Router);
 dataArgentina = inject(ApiArgentinaService); // Inyectar el servicio de países

 provincias: string[] = []; // Variable para almacenar los países
 ciudades: string[] = []; // Lista de ciudades
 selectedProvinciaId: string = ''; // Provincia seleccionada

 userService= inject(UserService);
 perfilService= inject(PerfilService);
 isPasswordVisible = false; // Controla la visibilidad de la contraseña
showProfileForm: boolean = false;// Variable para controlar la visibilidad del formulario de perfil



 // Formulario de registro 
 formularioRegistrase= this.fb.nonNullable.group({
  nombre: ['', Validators.required],
  apellido: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]]
 })

 // Formulario de perfil
 formularioPerfil = this.fb.group({
  username:['', [Validators.required,Validators.minLength(3), Validators.maxLength(20)]],
  descripcion: ['', [Validators.required]],
  provincia: ['', [Validators.required]],
  ciudad: ['', [Validators.required]],
  linkInstagram:['',[Validators.pattern(/^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+$/)]],
  linkLinkedIn: ['',[Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/)]],
  linkWeb: ['',[Validators.pattern(/^(https?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[a-zA-Z0-9#_-]*)*\/?$/)]],
  telefono:  ['', [Validators.required, Validators.pattern(/^[+]?(\d{1,4})?[-.\s]?(\d{1,3})[-.\s]?(\d{3})[-.\s]?(\d{4,})$/)]], 
  /*^[+]?[0-9]{1,4}?: Permite un prefijo de país opcional [-.\s]?: Permite guiones, puntos o espacios como separadores.
  [0-9]{1,3}: Permite uno a tres dígitos para la parte del número. */
  imagePerfil:['',[Validators.pattern(/^.*\.(jpg|jpeg|png|gif|bmp|webp)$/i)]]

});

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
  const provinciaSeleccionada = this.formularioPerfil.get('provincia')?.value;

  if (provinciaSeleccionada) {
    this.dataArgentina.getProvinciaIdByNombre(provinciaSeleccionada).subscribe({
      next: (idProvincia) => {
        if (idProvincia) {
          console.log('ID de la provincia:', idProvincia);

          // Obtener los municipios pasando el ID de la provincia
          this.dataArgentina.getLocalidadesIdProvincia(idProvincia).subscribe({
            next: (data: LocalidadesResponse) => {
              this.ciudades = data.localidades.map((localidad:Localidad) => localidad.nombre).sort();
              this.formularioPerfil.controls['ciudad'].reset(); // Resetear el campo de ciudad
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



validarFormularioRegistro() {
  if (this.formularioRegistrase.invalid) {
    return;
  }

  const formValue = this.formularioRegistrase.value;

  // Convertir el valor del formulario a un objeto User
  const newUser: User = {
    nombre: formValue.nombre,
    apellido: formValue.apellido,
    email: formValue.email ?? '', // Si formValue.email es undefined, asigna una cadena vacía
    password: formValue.password ?? '',
    createdAt: new Date(),
    deletedAt: null
  };

  const userEmail = this.formularioRegistrase.get('email')?.value; //se obtiene el email del formulario

  if (userEmail) {
    // Verificar si el correo ya está registrado
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        if (this.emailExists(users, userEmail)) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El usuario ya está registrado',
          });
        } else {
          this.showProfileForm = true; // Mostrar el formulario de perfil
        }
      },
      error: (error) => {
        console.error('Error al verificar el correo', error);
      },
    });
  }
}


  validarFormularioPerfil(){
    if (this.formularioPerfil.invalid) {
      return;
    }
    const formValue = this.formularioPerfil.value;

    // Convertir el valor del formulario a un objeto User
    const newPerfil: Perfil = {
      idUser:'',
      userName:formValue.username ?? '',
      descripcion:formValue.descripcion ?? '',
      provincia: formValue.provincia ?? '',
      ciudad:formValue.ciudad ?? '',
      linkInstagram:formValue.linkInstagram ?? '',
      linkLinkedIn: formValue.linkLinkedIn ?? '',
      linkWeb: formValue.linkWeb ?? '',
      telefono: this.normalizarTelefono(formValue.telefono ?? ''),
      imagePerfil: formValue.imagePerfil ?? '',
      listaFavoritos:[]
    };
  
    const username = this.formularioPerfil.get('username')?.value; //se obtiene el username del formulario
  
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
          this.registerUserAndProfile(); // Guardar usuario y perfil
        }
      }
      },
      error: (error) => {
        console.error('Error al verificar el username', error);
      },
    });
  }
// Método que verifica si el correo ya existe en el array de usuarios
private emailExists(users: User[], email: string): boolean {
  return users.some(user => user.email === email);
}

// Método que verifica si el username ya existe en el array de perfiles
private usernameExists(perfiles: Perfil[], username: string): boolean {
  return perfiles.some(perfil => perfil.userName === username);
}
//Metodo que transforma el telefono a un formato de telefono util para Whatsapp
private normalizarTelefono(telefono: string): string {
  // 1. Eliminar todos los caracteres no numéricos excepto el "+" inicial
  let numeroLimpio = telefono.replace(/[^0-9+]/g, '');

   // 2. Si no tiene un prefijo internacional, agregar +54 por defecto
  if (!numeroLimpio.startsWith('+')) {
    // Si no tiene prefijo, agregar por defecto +54 para Argentina
    numeroLimpio = '+54' + numeroLimpio;
  }

  // 3. Añadir "9" después de +54 para móviles si no está presente
  if (numeroLimpio.startsWith('+54') && !numeroLimpio.includes('9', 3)) {
    numeroLimpio = numeroLimpio.replace('+54', '+549');
  }

  // 4. Eliminar ceros iniciales del código de área si existen (por ejemplo, +549011 -> +54911)
  numeroLimpio = numeroLimpio.replace(/(\+549)(0+)/, '$1');

  return numeroLimpio;
}

// Método para mostrar el formulario de perfil
toggleProfileForm() {
  this.showProfileForm = !this.showProfileForm;
}

togglePasswordVisibility() {
  this.isPasswordVisible = !this.isPasswordVisible;
}

 // Registrar el usuario y el perfil
 private registerUserAndProfile() {
  const userFormValue = this.formularioRegistrase.value;
    const profileFormValue = this.formularioPerfil.value;

    const newUser: User = {
      nombre: userFormValue.nombre,
      apellido: userFormValue.apellido,
      email: userFormValue.email ?? '',
      password: userFormValue.password ?? '',
      createdAt: new Date(),
      deletedAt: null,
    };

    this.userService.addUser(newUser).subscribe({
      next: (user) => {
        const newProfile: Perfil = {
          idUser: user.id ?? '', // Asocia el perfil al usuario recién creado
          userName: profileFormValue.username ?? '',
          descripcion: profileFormValue.descripcion ?? '',
          provincia: profileFormValue.provincia ?? '',
          ciudad: profileFormValue.ciudad ?? '',
          linkInstagram: profileFormValue.linkInstagram ?? '',
          linkLinkedIn: profileFormValue.linkLinkedIn ?? '',
          linkWeb: profileFormValue.linkWeb ?? '',
          telefono: profileFormValue.telefono ?? '',
          imagePerfil: profileFormValue.imagePerfil ?? '',
        };

        this.perfilService.agregarPerfil(newProfile).subscribe({
          next: () => {const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Registro exitoso"
          });
          this.router.navigate(['/acceso']);
          },
          error: (error) => {
            console.error('Error al guardar el perfil', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Hubo un problema al guardar tu perfil. Intenta de nuevo.',
            });
          },
        });
      },
      error: (error) => {
        console.error('Error al registrar al usuario', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hubo un problema al registrar el usuario. Intenta de nuevo.',
        });
      },
    });
  }
}


