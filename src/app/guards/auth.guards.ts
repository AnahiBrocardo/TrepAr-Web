import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ControlAccesoService } from "../Servicios/auth/control-acceso.service";
import { routes } from "../app.routes";

export const loginGuard = () => { //retorna un valor booleano que indica si la navegación debe ser permitida o no

  const router = inject(Router);
  const loginService = inject(ControlAccesoService);

  if(localStorage.getItem('token') && localStorage.getItem('userId')){
    localStorage.setItem('token','123');
    return true;
  }else{
    router.navigateByUrl('acceso');
    return false;
  }
}