import { Component, OnInit, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/Interfaces/venta';
import {DetalleVenta} from 'src/app/Interfaces/detalle-venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit {

 fechaDeRegistro: string = '';
 numeroDocumento: string = '';
 tipoPago: string = '';
 total: string = '';
 detalleVenta: DetalleVenta[] = [];
 columnasTabla: string[]= ['producto', 'cantidad', 'precio', 'total'];

constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta){
  this.fechaDeRegistro = this._venta.fechaRegistro!;
  this.numeroDocumento = this._venta.numeroDocumento!;
  this.tipoPago = this._venta.tipoPago;
  this.total = this._venta.totalTexto;
  this.detalleVenta = this._venta.detalleVenta;
}

  ngOnInit(): void {
    if (!this._venta) return;

  this.detalleVenta = (this._venta.detalleVenta || []).map(dv => ({
    idProducto: dv.idProducto,
    descripcionProducto: dv.descripcionProducto,
    cantidad: dv.cantidad,
    precioTexto: dv.precioTexto,
    totalTexto: dv.totalTexto
  }));
 console.log('DetalleVenta mapeado:', this.detalleVenta);
}



}
