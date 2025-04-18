import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
interface DecodedToken {
    exp: number;
}
export const AuthGuard: CanActivateFn = (route, state) => {
    const token = localStorage.getItem('token');
    const router = inject(Router);

    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp > currentTime) {
            return true;
        } else {
            localStorage.removeItem('token');
            router.navigate(['/login']);
            return false;
        }
    } catch (error) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return false;
    }
};
