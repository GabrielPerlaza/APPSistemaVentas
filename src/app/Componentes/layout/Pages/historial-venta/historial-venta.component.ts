import { Component, OnInit,  AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ModalDetalleVentaComponent } from '../../Modals/modal-detalle-venta/modal-detalle-venta.component';
import { ModalUsuarioComponent } from '../../Modals/modal-usuario/modal-usuario.component';

import { VentaService } from '../../../../Services/venta.service';
import { Venta } from '../../../../Interfaces/venta';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';


import Swal from 'sweetalert2';


export const MY_DATA_FORMATS = {
  parse:{
    dateInput:'DD/MM/YYYY',
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel:'MMM YYYY'
  }
}

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class HistorialVentaComponent implements AfterViewInit {

  formularioBusqueda:FormGroup;
  opcionesBusqueda: any[] = [
    {value: 'fecha', descripcion: 'Por Fecha'},
    {value: 'numero', descripcion: 'Por Numero de Venta'}
  ];

  columnasTabla : string [] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  dataInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;


  constructor(
    private fb: FormBuilder,
    private dialog:MatDialog,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ){
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: [''],
    })

    this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(value =>{
      this.formularioBusqueda.patchValue({
        numero: "",
        fechaInicio: "",
        fechaFin: "",
      })
    })




  }


  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  aplicarFiltro(event: Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.datosListaVenta.filter = filterValue.trim().toLowerCase();
}

  buscarVentas(){
    let _fechaInicio : string = "";
    let _fechaFin : string = "";

    if(this.formularioBusqueda.value.buscarPor === "fecha"){
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

      if(_fechaInicio === "Invalid date" || _fechaFin === "Invalid date"){
       this._utilidadService.mostrarAlerta("Debe ingresar ambas fechas", "Oops"); 
          return;
        }
    }
    this._ventaService.Historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (data) => {
        if(data.status === true){
          this.datosListaVenta = data.value;
        }else {
          this._utilidadService.mostrarAlerta("No se encontraron datos", "Oops");
        }
      },
      error: (e) => {}
    });
  }

   verDetalleVenta(_venta: Venta){
      this.dialog.open(ModalDetalleVentaComponent, {
        data: _venta,
        disableClose: true,
        width: '700px'

      })
    }


}
