import { Component, inject, OnInit } from '@angular/core';
import { ControlAccesoService } from '../../Servicios/auth/control-acceso.service';
import { User } from '../../Interfaces/user.interface';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{
  logInService= inject(ControlAccesoService);
  userLoginOn:boolean=false;
  userData?:User;
  
  ngOnInit(): void {
  this.logInService.usuarioActualLoginOn.subscribe({
    next:(userLoginOn)=>{
      this.userLoginOn=userLoginOn;
    }
  })
  

  this.logInService.dataUsuarioActual.subscribe({
    next:(user:User)=>{
      this.userData=user;
      console.log(this.userData);
    }
  })
  }
   

}
