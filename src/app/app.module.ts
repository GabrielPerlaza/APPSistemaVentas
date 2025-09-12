import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './Componentes/login/login.component';
import { LayoutComponent } from './Componentes/layout/layout.component';
import { SharedModule } from './Reutilizable/shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalUsuarioComponent } from './Componentes/layout/Modals/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Componentes/layout/Modals/modal-producto/modal-producto.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    ModalUsuarioComponent, 
    ModalProductoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
