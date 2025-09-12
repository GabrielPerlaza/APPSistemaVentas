import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {


listaProductos: Producto[] = [];
listaProductosFiltros: Producto[] = [];

listaProductosParaVenta : DetalleVenta[] = [];
bloquearBotonRegistrar: boolean = false;

productosSeleccionados!: Producto;
tipoPagoPorDefecto: string = 'Efectivo';
totalPagar: number =0; 

formularioProductoVenta: FormGroup;
columnasTabla:string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

retornarProductosPorFiltro (busqueda:any):Producto[]{
  const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();
  return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
}

constructor(
  private fb: FormBuilder,
  private _productoService : ProductoService,
  private _ventaService : VentaService,
  private _utilidadService: UtilidadService
){
  this.formularioProductoVenta = this.fb.group({
    producto: ['', Validators.required],
    cantidad: ['', Validators.required],
  });
  this._productoService.lista().subscribe({
    next: (data: any) => {
      const lista = data.value as Producto[];
      this.listaProductos = lista.filter(p => p.esActivo === 1 && p.stock > 0);


      
    },
    error: (e) => {}
  })
  this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
    this.listaProductosFiltros = this.retornarProductosPorFiltro(value);
  });
   

}

  ngOnInit(): void {
  }

mostrarProducto(producto: Producto){
  return producto.nombre;
}

productoParaVenta(event: any){
  this.productosSeleccionados = event.option.value;
}

agregarProductoParaVenta(){
  const _cantidad : number = this.formularioProductoVenta.value.cantidad;
  const _precio : number = parseFloat(this.productosSeleccionados.precio);
  const _total: number = _cantidad * _precio;
  this.totalPagar = this.totalPagar + _total;

  this.listaProductosParaVenta.push({
    idProducto: this.productosSeleccionados.idProducto,
    descripcionProducto: this.productosSeleccionados.nombre,
    cantidad: _cantidad,
    precioTexto: String(_precio.toFixed(2)),
    totalTexto: String(_total.toFixed(2))

  });

  this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  this.formularioProductoVenta.patchValue({
    producto: '',
    cantidad: ''
  })
}

eliminarProducto(detalle: DetalleVenta){
  this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto);
  this.listaProductosParaVenta = this.listaProductosParaVenta.filter( p => p.idProducto !== detalle.idProducto);
  
  this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
}

registrarVenta(){
  if(this.listaProductosParaVenta.length > 0){
    this.bloquearBotonRegistrar = true;

    const request: Venta = {
      tipoPago: this.tipoPagoPorDefecto,
      totalTexto: String(this.totalPagar.toFixed(2)),
      detalleVenta: this.listaProductosParaVenta
    }

    

    this._ventaService.Registrar(request).subscribe({
      next: (response) => {
        if(response.status){
          this.totalPagar = 0.00;
          this.listaProductosParaVenta = [];
          this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
         Swal.fire({  
          title: 'Venta registrada',
          text: `Número de venta: ${response.value.numeroDocumento}`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
         }
        else 
          this._utilidadService.mostrarAlerta("No se pudo registrar la venta", "Oops");
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        }, 
        error: (e) => {}
      });
      console.log("Request a enviar:", request);
    }
    
  
  }
  
  }
        
        
    
  
   
      
 


