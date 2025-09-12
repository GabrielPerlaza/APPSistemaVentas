import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../Modals/modal-producto/modal-producto.component';
import { ProductoService } from 'src/app/Services/producto.service';
import { Producto } from 'src/app/Interfaces/producto';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import Swal from 'sweetalert2';



@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit{
 
  
columnasTabla: string[] = ['nombre', 'categoria', 'stock','precio', 'estado', 'acciones'];
dataInicio: Producto[]=[];
dataListaProductos = new MatTableDataSource(this.dataInicio);


constructor(
    private dialog : MatDialog,
    private _productoServicio : ProductoService,
    private _utilidadServicio : UtilidadService
  ){}

  obtenerProducto(){
    this._productoServicio.lista().subscribe({
    next: (data: any) => {
      if(data.status)
        this.dataListaProductos.data = data.value; 
      else
        this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops")  
    },
    error: (e) => {}
  })
  }

  

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;




   ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }


  ngOnInit(): void {
    this.obtenerProducto();
  }

  aplicarFiltro(event: Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataListaProductos.filter = filterValue.trim().toLowerCase();
}


nuevoProducto(){
  this.dialog.open(ModalProductoComponent, {
    disableClose: true,

  }).afterClosed().subscribe(resultado =>{
    if(resultado === true) this.obtenerProducto();
  });
}

editarProducto(producto: Producto){
  this.dialog.open(ModalProductoComponent, {
    disableClose: true,
    data: producto
  }).afterClosed().subscribe(resultado =>{
    if(resultado === true) this.obtenerProducto();
  });
}

eliminarProducto(producto: Producto){
  Swal.fire({
    title: '¿Deseas eliminar el usuario?',
    text: 'Usuario: '+ producto.nombre,
    icon: 'warning',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Si, eliminar',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: 'No, volver'
  }).then((resultado) => {
    if(resultado.isConfirmed){
      this._productoServicio.Eliminar(producto.idProducto).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("Producto eliminado", "Listo");
            this.obtenerProducto();
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto", "Error");              
        }, 
        error : (e) => {}
      })
    }
  })

}
}
