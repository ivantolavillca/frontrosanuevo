import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';


import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { Students } from '../../students.model';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
export interface DialogData {
  id: number;
  action: string;
  student: Students;
}

@Component({
    selector: 'app-students-form',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    imports: [
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        CommonModule,
        MatCheckboxModule
    ]
})
export class StudentsFormComponent {
  personaForm: FormGroup;
  esEdicion: boolean;
  constructor(
    public dialogRef: MatDialogRef<StudentsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {

    this.esEdicion = data.esEdicion;
    this.personaForm = this.fb.group({
      nombre_completo: [data.persona?.nombre_completo || '', [Validators.required, Validators.minLength(3)]],
      genero: [data.persona?.genero.id?.toString() || '', Validators.required],
      edad: [data.persona?.edad || '', [Validators.required, Validators.min(13), Validators.max(18)]],
      peso: [data.persona?.peso || '', Validators.required],
      estatura: [data.persona?.estatura || '', Validators.required],
      antecedentes_familiares: [data.persona?.antecedentes_familiares.id || [1], Validators.required],
      condiciones_medicas: [data.persona?.condiciones_medicas.id || [1], Validators.required],
      consumo_medicamentos: [data.persona?.consumo_medicamentos.id || [1], Validators.required],
      estres_ansiedad: [data.persona?.estres_ansiedad.id || [1], Validators.required],
      actividades_fisicas: [data.persona?.actividades_fisicas.id || [1], Validators.required],
      comida_diaria: [data.persona?.comida_diaria.id || '', Validators.required],
      consumo_comida_rapida: [data.persona?.consumo_comida_rapida.id || [1], Validators.required],
    });
  }

  guardar() {
    if (this.personaForm.valid) {
      this.dialogRef.close(this.personaForm.value);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
