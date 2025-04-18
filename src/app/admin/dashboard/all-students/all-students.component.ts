import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { StudentsFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { StudentsDeleteComponent } from './dialogs/delete/delete.component';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { StudentsService } from './students.service';
import { Students } from './students.model';
import { rowsAnimation, TableExportUtil } from '@shared';
import { formatDate, DatePipe, CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Direction } from '@angular/cdk/bidi';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PersonaService } from 'app/services/persona.service';
import { Persona } from 'app/interfaces/Personas';
import { Clasificacion } from 'app/interfaces/Clasificacion';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-all-students',
    templateUrl: './all-students.component.html',
    styleUrls: ['./all-students.component.scss'],
    animations: [rowsAnimation],
    imports: [
    BreadcrumbComponent,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    FeatherIconsComponent
]
})
export class AllStudentsComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id', label: '#', type: 'text', visible: true },
    { def: 'nombre_completo', label: 'Nombre completo', type: 'text', visible: true },
    { def: 'edad', label: 'Edad', type: 'text', visible: true },
    { def: 'gender', label: 'Genero', type: 'text', visible: true },
    { def: 'department', label: 'Peso', type: 'text', visible: true },
    {
      def: 'date_of_birth',
      label: 'IMC',
      type: 'tex',
      visible: true,
    },
    { def: 'address', label: 'Estatura', type: 'text', visible: true },
    { def: 'phone', label: 'Estado fisico', type: 'text', visible: true },
  
    { def: 'actions', label: 'Acciones', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Students>([]);
  selection = new SelectionModel<Students>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'Personas',
      items: ['personas'],
      active: 'Lista de personas',
    },
  ];

  constructor(
    private fb: FormBuilder,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public studentsService: StudentsService,
    private snackBar: MatSnackBar,
    private personaService: PersonaService
  ) {}

    personas: Persona[] = [];
    clasificaciones: Clasificacion[] = [];
    personaSeleccionado: Persona = {
        nombre_completo: '',
        edad: 0,
        peso: 0,
        estatura: 0,
        genero: { id: 0, nombre: '' },
        clasificacion: { id: 0, nombre: '' },
    };
    mostrarModal: boolean = false;
    esEdicion: boolean = false;
    terminoBusqueda: string = '';
    paginaActual: number = 1;
    personasPorPagina: number = 5;
    totalPersonas: number = 0;
    personasPaginadas: Persona[] = [];
    personaForm!: FormGroup;
  ngOnInit() {
    this.initForm();
    this.GetPersonas();
  }
   private initForm() {
    this.personaForm = this.fb.group({
      nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
      genero: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(13), Validators.max(18)]],
      peso: [null, Validators.required],
      estatura: [null, Validators.required],
    });
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
  this.openDialog(false);
}

abrirModalEditar(persona: Persona): void {
  this.openDialog(true, persona);
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
              Swal.fire({
                title: "Editado exitosamente!",
                icon: "success",
                draggable: true
            });
              this.GetPersonas();
            
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  loadData() {
    this.studentsService.getAllStudents().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: Students, filter: string) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter)
          );
      },
      error: (err) => console.error(err),
    });
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }





  openDialog(esEdicion: boolean, persona?: Persona): void {
    const dialogRef = this.dialog.open(StudentsFormComponent, {
      width: '800px',
      data: { esEdicion, persona },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (esEdicion) {
          this.personaService.UpdatePersona(persona!.id!, result).subscribe({
            next: () => {
              this.GetPersonas();
              Swal.fire({
                title: "Editado exitosamente!",
                icon: "success",
                draggable: true,
              });
            },
            error: () => {
              Swal.fire({
                title: 'Error al editar',
                text: 'No se pudo editar la persona',
                icon: 'error',
              });
            },
          });
        } else {
          this.personaService.CreatePersona(result).subscribe({
            next: () => {
              this.GetPersonas();
              Swal.fire({
                title: "Guardado exitosamente!",
                icon: "success",
                draggable: true,
              });
            },
            error: () => {
              Swal.fire({
                title: 'Error al crear',
                text: 'No se pudo crear la persona',
                icon: 'error',
              });
            },
          });
        }
      }
    });
  }

  private updateRecord(updatedRecord: Students) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: Students) {
    const dialogRef = this.dialog.open(StudentsDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.id !== row.id
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-danger',
          'Delete Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      Name: x.name,
      Email: x.email,
      Gender: x.gender,
      Mobile: x.mobile,
      Department: x.department,
      'Roll Number': x.rollNo,
      'Date of Birth':
        formatDate(new Date(x.date_of_birth), 'yyyy-MM-dd', 'en') || '',
      Address: x.address,
      'Enrollment Date':
        formatDate(new Date(x.enrollment_date), 'yyyy-MM-dd', 'en') || '',
      'Graduation Year': x.graduation_year,
      'Parent/Guardian Name': x.parent_guardian_name,
      'Parent/Guardian Mobile': x.parent_guardian_mobile,
      Status: x.status,
      'Profile Completion': x.profile_completion_status,
      'Scholarship Status': x.scholarship_status,
    }));

    TableExportUtil.exportToExcel(exportData, 'student_export');
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }
  onContextMenu(event: MouseEvent, item: Students) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
