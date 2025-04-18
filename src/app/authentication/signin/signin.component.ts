import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, Role } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AccesoService } from 'app/services/acceso.service';
import { Login } from 'app/interfaces/login';
import { jwtDecode } from 'jwt-decode';
@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    imports: [
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
    ]
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _authService: AccesoService,
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  adminSet() {
    this.authForm.get('email')?.setValue('admin@school.org');
    this.authForm.get('password')?.setValue('admin@123');
  }
  teacherSet() {
    this.authForm.get('email')?.setValue('teacher@school.org');
    this.authForm.get('password')?.setValue('teacher@123');
  }
  studentSet() {
    this.authForm.get('email')?.setValue('student@school.org');
    this.authForm.get('password')?.setValue('student@123');
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
     this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Correo o contraseña no valido !';
      return;
    } else {
      const objeto: Login = {
        email: this.f['email'].value,
        password: this.f['password'].value,
    };
       this._authService
        .login(objeto)
        .subscribe({
          next: (data) => {
            if (data) {
              setTimeout(() => {
                localStorage.setItem('token', data.access);
                const decodedToken: any= jwtDecode(data.access);
                const authUser = {
                    first_name: decodedToken.first_name,
                    last_name: decodedToken.last_name,
                    role: decodedToken.groups.length > 0 ? decodedToken.groups[0] : 'User',
                    email: decodedToken.email,
                    id: decodedToken.user_id,
                  };
                localStorage.setItem('auth_user', JSON.stringify(authUser));
                this.loading = false;
                this.router.navigate(['/admin/dashboard/main']);
              }, 1000);
            } else {
              this.error = 'Correo o contraseña no valido !';
            }
          },
          error: (error) => {
            this.error = 'Correo o contraseña no valido !';
            this.submitted = false;
            this.loading = false;
          },
        });
    }
  }
}


