import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ControlAccesoService } from "../Servicios/auth/control-acceso.service";

export const loginGuard = () => { //retorna un valor booleano que indica si la navegación debe ser permitida o no

  const router = inject(Router);
  const loginService = inject(ControlAccesoService);

}