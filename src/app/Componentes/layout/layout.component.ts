import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Menu } from 'app/Interfaces/menu';
import { MenuService } from '../../Services/menu.service';
import { UtilidadService } from 'app/Reutilizable/utilidad.service';





@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent implements OnInit {
  
  listaMenus: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario : string = '';


  
  constructor(
        private router: Router,
        private _menuService: MenuService,
        private _utilidadService: UtilidadService
  ){}



  
  ngOnInit(): void {
    
    const usuario = this._utilidadService.obtenerSesionUsuario();
      if(usuario != null){
        this.correoUsuario = usuario.correo;
        this.rolUsuario = usuario.rolDescripcion;
      }
    console.log('ID Usuario:', usuario.idUsuario);

    this._menuService.lista(usuario.idUsuario).subscribe({
      next: (data) =>{
        if(data.status)this.listaMenus = data.value;

      },
      error: (e) =>{}
    });
  }


  cerrarSesion(){
    this._utilidadService.eliminarSesionUsuario();
    this.router.navigate(['/login']);
  }

}
