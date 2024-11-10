import { Component, inject, OnInit } from '@angular/core';
import { ControlAccesoService } from '../../Servicios/auth/control-acceso.service';
import { User } from '../../Interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';

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

}
