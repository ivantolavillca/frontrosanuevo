import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from 'app/services/profile.service';
import { UserUpdate } from 'app/interfaces/UserUpdate';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
// Validador personalizado para la contraseña
function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Si no hay valor, no se valida
    }

    const errors: ValidationErrors = {};

    if (value.length < 8) {
      errors.minLength = 'Esta contraseña es demasiado corta. Debe contener al menos 8 caracteres.';
    }

    if (/^\d+$/.test(value)) {
      errors.numeric = 'Esta contraseña es completamente numérica.';
    }

    const commonPasswords = ['12345678', 'password', 'qwerty']; // Ejemplo de contraseñas comunes
    if (commonPasswords.includes(value)) {
      errors.common = 'Esta contraseña es demasiado común.';
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.scss'
})
export class PerfilUsuarioComponent implements OnInit {

  profileForm: FormGroup;
  nombre_usuario: string;
  email_usuario: string;
  rol_usuario: string;

  constructor(
    private fb: FormBuilder,
    private profilesv: ProfileService
  ) {
    this.profileForm = this.fb.group({
      nombre_usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido_usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email_usuario: ['', [Validators.required, Validators.email]],
      password_usuario: ['', [Validators.required, passwordValidator()]] // Se agrega el validador personalizado
    });
  }

  ngOnInit(): void {
    const user = localStorage.getItem('auth_user');
    const user_dato = JSON.parse(user);
    this.nombre_usuario = user_dato.first_name + ' ' + user_dato.last_name;
    this.email_usuario = user_dato?.email;
    this.rol_usuario = user_dato?.role;

    // Pre-cargar los valores en el formulario
    this.profileForm.patchValue({
      nombre_usuario: user_dato.first_name,
      apellido_usuario: user_dato.last_name,
      email_usuario: user_dato?.email
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const profileData: UserUpdate = {
        email: this.profileForm.value.email_usuario,
        first_name: this.profileForm.value.nombre_usuario,
        last_name: this.profileForm.value.apellido_usuario,
        password: this.profileForm.value.password_usuario
      };

      this.profilesv.updateUser(profileData).subscribe({
        next: (response) => {
          Swal.fire({
            title: "Guardado exitosamente!",
            icon: "success",
            draggable: true
          });
        },
        error: (error) => {
          Swal.fire({
            title: "Servicio no disponible",
            icon: "error",
            draggable: true
          });
        }
      });
    }
  }
}