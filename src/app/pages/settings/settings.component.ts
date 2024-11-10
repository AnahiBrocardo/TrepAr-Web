import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../Interfaces/user.interface';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../Servicios/usuario/user.service';
import { UpdateUserComponent } from '../update/update-user/update-user.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [UpdateUserComponent, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{
   userService= inject(UserService);
  userLoginOn:boolean=false;
  userData?:User;
  // Control de visibilidad del formulario
  mostrarFormulario: boolean = false;

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
   this.usuarioData(this.userId);
  }

  usuarioData(id:string){
    this.userService.getUserById(id).subscribe({
      next:(user:User)=>{
        this.userData=user;
      },
      error:(e:Error)=>{
        console.log(e);
      }
    })
  }
  // Método para alternar la visibilidad del formulario
  toggleModificar() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

}
