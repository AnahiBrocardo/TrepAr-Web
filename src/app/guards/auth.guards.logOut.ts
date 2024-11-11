import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ControlAccesoService } from "../Servicios/auth/control-acceso.service";
import { routes } from "../app.routes";

export const logOutGuard = () => { //retorna un valor booleano que indica si la navegación debe ser permitida o no

  const router = inject(Router);
  const service= inject(ControlAccesoService);

  if(!localStorage.getItem('token')){ //si no existe un token
    return true;
  }else{
    // Si el usuario ya está logueado (token existe), redirigimos al dashboard
    const userId = service.getUserId(); // Aquí deberías obtener el ID real del usuario
    router.navigateByUrl(`dashboard/${userId}`);
    return false;
  }
}