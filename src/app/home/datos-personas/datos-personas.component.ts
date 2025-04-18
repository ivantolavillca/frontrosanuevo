import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Persona } from 'app/interfaces/Personas';
import { PersonaService } from './../../services/persona.service';
import Swal from 'sweetalert2';
import { Clasificacion } from 'app/interfaces/Clasificacion';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-datos-personas',
    standalone: true,
    imports: [MatIconModule, RouterModule, FormsModule, CommonModule, MatPaginatorModule, MatIconModule],
    templateUrl: './datos-personas.component.html',
    styleUrls: ['./datos-personas.component.scss'],
})
export class DatosPersonasComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private personaService: PersonaService) {}

    isLoading: boolean = false;
    personas: Persona[] = [];
    clasificaciones: Clasificacion[] = [];
    personaSeleccionado: Persona = {
        nombre_completo: '',
        edad: 0,
        peso: 0,
        estatura: 0,
        genero: '', 
        clasificacion: null,
        imc: null,
    };
    nombredeuser: string;
    mostrarModal: boolean = false;
    esEdicion: boolean = false;
    terminoBusqueda: string = '';
    paginaActual: number = 1;
    personasPorPagina: number = 5;
    totalPersonas: number = 0;
    personasPaginadas: Persona[] = [];

    ngOnInit() {
        this.GetPersonas();
    }

    GetPersonas(): void {
        this.isLoading = true;
        const offset = (this.paginaActual - 1) * this.personasPorPagina;
        this.personaService.GetPersonas(this.personasPorPagina, offset, this.terminoBusqueda).subscribe({
            next: (data) => {
                this.personas = data.results; // Actualiza la lista de personas
                this.totalPersonas = data.count; // Actualiza el total de personas
                this.personasPaginadas = data.results; // Asigna directamente los resultados paginados
                this.isLoading = false;
            },
            error: (err) => {
                Swal.fire({
                    title: "Servicio no disponible",
                    icon: "error",
                    draggable: true
                });
                this.isLoading = false;
            },
        });
    }

    cambiarPagina(event: PageEvent): void {
        this.paginaActual = event.pageIndex + 1; // Actualiza la página actual
        this.personasPorPagina = event.pageSize; // Actualiza el tamaño de la página
        this.GetPersonas(); // Llama a GetPersonas para obtener los datos de la nueva página
    }

    CrearPersona(): void {
        this.isLoading = true;
        this.personaSeleccionado = {
            nombre_completo: '',
            edad: null,
            peso: null,
            estatura: null,
            genero: '',  
            clasificacion: null,
            imc: null,
        };

        this.esEdicion = false;
        this.mostrarModal = true;
        this.isLoading = false;
    }

    abrirModalEditar(persona: Persona): void {
        this.isLoading = true;
        this.personaSeleccionado = { ...persona, clasificacion: null, imc: null };
        this.esEdicion = true;
        this.mostrarModal = true;
        this.isLoading = false;
    }

    guardarPersona(form: NgForm): void {
        if (form.invalid) {
            return; // No guardar si el formulario es inválido
        }

        if (this.esEdicion) {
            // Lógica para editar
            this.personaService.UpdatePersona(this.personaSeleccionado.id!, this.personaSeleccionado).subscribe({
                next: () => {
                    this.mostrarModal = false;
                    this.GetPersonas();
                    Swal.fire({
                        title: "Editado exitosamente!",
                        icon: "success",
                        draggable: true
                    });
                },
                error: (err) => console.error('Error al editar persona', err),
            });
        } else {
            // Lógica para crear
            this.personaService.CreatePersona(this.personaSeleccionado).subscribe({
                next: () => {
                    this.mostrarModal = false;
                    this.GetPersonas();
                    Swal.fire({
                        title: "Guardado exitosamente!",
                        icon: "success",
                        draggable: true
                    });
                },
                error: (err) => console.error('Error al crear persona', err),
            });
        }
    }

    EliminarPersona(id: number): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.personaService.DeletePersona(id).subscribe(
                    () => this.GetPersonas(),
                    (error) => console.error(error)
                );
            }
        });
    }

    download(format: string) {
        this.personaService.exportData(format).subscribe((data: Blob) => {
            const blob = new Blob([data], { type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `personas.${format}`;
            link.click();
        });
    }
}
