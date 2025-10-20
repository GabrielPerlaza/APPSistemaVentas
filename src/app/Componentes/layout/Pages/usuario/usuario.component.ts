import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../Modals/modal-usuario/modal-usuario.component';
import { UsuarioService } from '../../../../Services//usuario.service';
import { Usuario } from '../../../../Interfaces/usuario';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit{
  columnasTabla: string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'acciones'];
  dataInicio: Usuario[]=[];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;


  constructor(
    private dialog : MatDialog,
    private _usuarioServicio : UsuarioService,
    private _utilidadServicio : UtilidadService
  ){}

  obtenerUsuario(){
    this._usuarioServicio.lista().subscribe({
    next: (data: any) => {
      if(data.status)
        this.dataListaUsuarios.data = data.value; 
      else
        this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops")  
    },
    error: (e) => {}
  })
  }

ngOnInit(): void {
  this.obtenerUsuario();
}

ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
}

aplicarFiltro(event: Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataListaUsuarios.filter = filterValue.trim().toLowerCase();
}

nuevoUsuario(){
  this.dialog.open(ModalUsuarioComponent, {
    disableClose: true,

  }).afterClosed().subscribe(resultado =>{
    if(resultado === true) this.obtenerUsuario();
  });
}

editarUsuario(usuario: Usuario){
  this.dialog.open(ModalUsuarioComponent, {
    disableClose: true,
    data: usuario
  }).afterClosed().subscribe(resultado =>{
    if(resultado === true) this.obtenerUsuario();
  });
}

eliminarUsuario(usuario: Usuario){
  Swal.fire({
    title: '¿Deseas eliminar el usuario?',
    text: 'Usuario: '+ usuario.nombreCompleto,
    icon: 'warning',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Si, eliminar',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: 'No, volver'
  }).then((resultado) => {
    if(resultado.isConfirmed){
      this._usuarioServicio.Eliminar(usuario.idUsuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("Usuario eliminado", "Listo");
            this.obtenerUsuario();
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario", "Error");
        }, 
        error : (e) => {}
      })
    }
  })
}

}
