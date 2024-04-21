import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';

const routes: Routes = [
  {path:"", component: LoginComponent, pathMatch: 'full'},
  {path: "login", component: LoginComponent, pathMatch: 'full' },
  {path: "login", component: LoginComponent, pathMatch: 'full' },
  {path: "page", loadChildren: () => import("./Componentes/layout/layout.module").then(m => m.LayoutModule)},
  {path: "", redirectTo:'login', pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
