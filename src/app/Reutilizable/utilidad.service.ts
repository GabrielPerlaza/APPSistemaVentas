import { Injectable, OnInit } from '@angular/core';

import {MatSnackBar} from '@angular/material/snack-bar';

import {Sesion} from '../Interfaces/sesion';



@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackbar: MatSnackBar) { }

  mostrarAlerta(mensaje: string, tipo : string){
    this._snackbar.open(mensaje, tipo, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    })
  }

  guardarSesionUsuario(usuarioSesion: Sesion){
    localStorage.setItem("usuarioSesion", JSON.stringify(usuarioSesion));
}

obtenerSesionUsuario(){
const dataCadena = localStorage.getItem("usuarioSesion");

const usuario = JSON.parse(dataCadena!);

return usuario;
}

eliminarSesionUsuario(){
  localStorage.removeItem("usuarioSesion");
}
}
