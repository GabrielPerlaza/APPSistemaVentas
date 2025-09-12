import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Login} from '../../Interfaces/login';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
formularioLogin: FormGroup;
ocultarPassword: boolean = true;
mostrarLoading: boolean = false;

constructor(
  private fb: FormBuilder,
  private router: Router,
  private _usuarioService: UsuarioService,
  private _utilidadService: UtilidadService
){
  this.formularioLogin = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
}



iniciarSesion(){
  this.mostrarLoading = true;

  const request : Login = {
    correo: this.formularioLogin.value.email,
    clave: this.formularioLogin.value.password
  }

  this._usuarioService.IniciarSesion(request).subscribe({
    next : (data) => {
      if(data.status){
        this._utilidadService.guardarSesionUsuario(data.value);
        this.router.navigate(["pages"]);
      }else
        this._utilidadService.mostrarAlerta("No se encontro coincidencias", "Ups");
      },
      complete : () => {
        this.mostrarLoading = false;
      },
      error: ()=> {
        this._utilidadService.mostrarAlerta("Hubo un error", "Oopps");
        this.mostrarLoading = false;
      } 
    })
}
ngOnInit(): void {}
}
