import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccesoService } from '../services/acceso.service';
import { jwtDecode } from 'jwt-decode';
interface DecodedToken {
    exp: number;
}

export const noAuthGuard: CanActivateFn = (route, state) => {
    const token = localStorage.getItem('token');
    const router = inject(Router);

    if (!token) {
      return true;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
//prueba

      if (decoded.exp > currentTime) {
        // Token válido, redirige al inicio
        router.navigate(['/inicio']);
        return false;
      } else {
        // Token expirado, se permite acceso a la ruta pública
        localStorage.removeItem('token');
        return true;
      }
    } catch (error) {
      // Token inválido, se permite acceso a la ruta pública
      localStorage.removeItem('token');
      return true;
    }
  };
