import { Routes } from '@angular/router';
import { DatosPersonalesComponent } from 'app/home/datos-personales/datos-personales.component';
import { InicioComponent } from './inicio/inicio.component';
import { DatosPersonasComponent } from './datos-personas/datos-personas.component';
import { ModeloComponent } from './modelo/modelo.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';

export default [
    {
        path     : 'inicio',
        component: InicioComponent,
    },
    {
        path     : 'datos-personales',
        component: DatosPersonalesComponent,
    },
    {
        path     : 'personas',
        component: DatosPersonasComponent,
    },
    {
        path     : 'modelo', 
        component: ModeloComponent,
    },
    {
        path     : 'perfil-usuario', 
        component: PerfilUsuarioComponent,
    },
    

] as Routes;
