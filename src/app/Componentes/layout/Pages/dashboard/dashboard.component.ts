import { Component, OnInit } from '@angular/core';


import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'app/Services/dashboard.service';
Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit { 
  
  
  totalIngresos:string = '0';
  totalVentas:string = '0';
  totalProductos:string = '0';
  
  constructor(private _dashboardServicio: DashboardService) {}


  mostrarGrafico(labelGrafico:any[] , dataGrafico:any[]){

    const chartBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: '# de ventas',
          data: dataGrafico,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
  }

  ngOnInit(): void {
    this._dashboardServicio.Resumen().subscribe({
      next: (data) => {
        if(data.status){
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData: any[] = data.value.ventas_UltimaSemana;
          

          const labelTemporal = arrayData.map(value => value.fecha);
          const dataTemporal = arrayData.map(value => value.total);
          
          setTimeout(() => {
          this.mostrarGrafico(labelTemporal, dataTemporal);
          }, 0);

        }
      },
      error: (e) => console.error(e)
  });
  }
}
