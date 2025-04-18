import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModeloService } from 'app/services/modelo.service';
import { RequestModelo } from 'app/interfaces/Modelo';
@Component({
  selector: 'app-modelo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modelo.component.html',
  styleUrls: ['./modelo.component.scss']
})
export class ModeloComponent {
  saludForm: FormGroup;
  categoriaIMC: string | null = null; // Para almacenar la categoría del IMC
  imagenUrl: string | null = null; // Para almacenar la URL de la imagen
  value: number = null;
  edades: number[] = [13, 14, 15, 16, 17, 18]; // Rango de edades permitidas
  imagenes = {
    1: 'assets/images/peso1.png',
    2: 'assets/images/peso2.png',
    3: 'assets/images/peso3.png',
    4: 'assets/images/peso4.png',
    5: 'assets/images/peso5.png',
    6: 'assets/images/peso6.png'
  };

  constructor(private fb: FormBuilder, private modeloService: ModeloService) { // Inyecta el servicio
    this.saludForm = this.fb.group({
      edad: [13, Validators.required], // Por defecto, selecciona 13 años
      peso: ['', [Validators.required, Validators.min(0), Validators.max(500)]],
      estatura: ['', [Validators.required, Validators.min(0), Validators.max(300)]],
      genero: ['', Validators.required] // Agregado el campo de género
    });
  }

  onSubmit() {
    if (this.saludForm.valid) {
      const request: RequestModelo = {
        peso: this.saludForm.get('peso')?.value,
        edad: this.saludForm.get('edad')?.value,
        estatura: this.saludForm.get('estatura')?.value,
        genero: this.saludForm.get('genero')?.value 
      };

      this.modeloService.GetModeloMachineLearning(request).subscribe(
        (response) => {
          this.imagenUrl = this.obtenerImagenCategoria(response.prediccion);
        },
        (error) => {
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
    if (estado ==6) {
      return 'Obesidad III';
    } else if (estado == 5) {
      return 'Obesidad II';
    } else if (estado == 4) {
      return 'Obesidad I';
    } else if (estado == 3) {
      return 'Sobrepeso';
    } else if (estado == 2) {
      return 'Normal';
    } else if (estado == 1) {
      return 'Bajo';
    }
  }

  getRecomendaciones(estado: number): string {
    if (estado == 6) {
      return 'Es importante buscar ayuda médica para un plan de pérdida de peso.';
    } else if (estado == 5) {
      return 'Se recomienda una dieta balanceada y ejercicio regular.';
    } else if (estado == 4) {
      return 'Considera cambios en tu estilo de vida para mejorar tu salud.';
    } else if (estado == 3) {
      return 'Mantén una dieta saludable y ejercicio regular.';
    } else if (estado == 2) {
      return 'Sigue con tu estilo de vida saludable.';
    } else if (estado == 1) {
      return 'Consulta a un médico para asegurarte de que estás en buen estado de salud.';
    }
  }
}
