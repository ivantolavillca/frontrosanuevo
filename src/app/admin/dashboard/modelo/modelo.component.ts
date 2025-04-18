import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModeloService } from 'app/services/modelo.service';
import { RequestModelo } from 'app/interfaces/Modelo';
import { NgModule } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from "../../../shared/components/breadcrumb/breadcrumb.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-modelo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    BreadcrumbComponent,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  templateUrl: './modelo.component.html',
  styleUrls: ['./modelo.component.scss']
})
export class ModeloComponent {
  saludForm: FormGroup;
  categoriaIMC: string | null = null; // Para almacenar la categoría del IMC
  imagenUrl: string | null = null; // Para almacenar la URL de la imagen
  value: number = 0;
  edades: number[] = [13, 14, 15, 16, 17, 18]; // Rango de edades permitidas
  imagenes = {
    1: 'assets/imagesn/peso1.png',
    2: 'assets/imagesn/peso2.png',
    3: 'assets/imagesn/peso3.png',
    4: 'assets/imagesn/peso4.png',
    5: 'assets/imagesn/peso5.png',
    6: 'assets/imagesn/peso6.png'
  };
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private modeloService: ModeloService) { // Inyecta el servicio
    this.saludForm = this.fb.group({
      // Datos Personales
      edad: ['', Validators.required], // Por defecto, selecciona 13 años
      peso: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
      estatura: ['', [Validators.required, Validators.min(0), Validators.max(2.5)]],
      genero: ['', Validators.required], // Valor predeterminado como número (1 para Masculino)

      // Factores de Salud
      antecedentes_familiares: [1],
      condiciones_medicas: [1],
      consumo_medicamentos: [1],
      estres_ansiedad: [1],

      // Estilo de Vida y Hábitos
      actividades_fisicas: [1],
      comida_diaria: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      consumo_comida_rapida: [1]
    });
  }

  onSubmit() {
    if (this.saludForm.valid) {
      this.isLoading = true; 
      const request: RequestModelo = {
        peso: this.saludForm.get('peso')?.value,
        edad: this.saludForm.get('edad')?.value,
        estatura: this.saludForm.get('estatura')?.value,
        genero: Number(this.saludForm.get('genero')?.value),
        antecedentes_familiares: this.saludForm.get('antecedentes_familiares')?.value,
        condiciones_medicas: this.saludForm.get('condiciones_medicas')?.value,
        consumo_medicamentos: this.saludForm.get('consumo_medicamentos')?.value,
        estres_ansiedad: this.saludForm.get('estres_ansiedad')?.value,
        actividades_fisicas: this.saludForm.get('actividades_fisicas')?.value,
        comida_diaria: this.saludForm.get('comida_diaria')?.value,
        consumo_comida_rapida: this.saludForm.get('consumo_comida_rapida')?.value
      };
  
      this.modeloService.GetModeloMachineLearning(request).subscribe(
        (response) => {
          this.isLoading = false;
          this.imagenUrl = this.obtenerImagenCategoria(response.prediccion);
        },
        (error) => {
          this.isLoading = false;
          console.error('Error al obtener la predicción:', error);
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

  obtenerImagenCategoria(prediccion: number): string {
    this.value = prediccion;
    return this.imagenes[prediccion as keyof typeof this.imagenes];
  }

  getEstadoFisico(estado: number): string {
    if (estado === 6) {
      return 'Obesidad III';
    } else if (estado === 5) {
      return 'Obesidad II';
    } else if (estado === 4) {
      return 'Obesidad I';
    } else if (estado === 3) {
      return 'Sobrepeso';
    } else if (estado === 2) {
      return 'Normal';
    } else if (estado === 1) {
      return 'Bajo';
    } else {
      return 'Estado desconocido'; // Valor predeterminado
    }
  }

  getRecomendaciones(estado: number): string {
    switch (estado) {
      case 6:
        return 'Es importante buscar ayuda médica para un plan de pérdida de peso.';
      case 5:
        return 'Se recomienda una dieta balanceada y ejercicio regular.';
      case 4:
        return 'Un plan de alimentación saludable puede ser útil.';
      case 3:
        return 'Mantén un estilo de vida activo y saludable.';
      case 2:
        return 'Continúa con hábitos saludables para mantener tu estado físico.';
      case 1:
        return 'Considera aumentar tu ingesta calórica de manera controlada.';
      default:
        return 'No hay recomendaciones disponibles para este estado.'; // Valor predeterminado
    }
  }
}