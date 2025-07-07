import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
//import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-dashboard-gerente',
  imports: [NgChartsModule, CommonModule, FormsModule],
  templateUrl: './dashboard-gerente.component.html',
  //styleUrl: './dashboard-gerente.component.css'
  styleUrls: ['./dashboard-gerente.component.css']
})
export class DashboardGerenteComponent implements OnInit {
  pacientes = 0;
  secretarias = 0;
  medicos = 0;
  turnos = 0;


  // Gráfico: Turnos por Especialidad
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true
  };


  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Turnos por especialidad' }]
  };


  // Gráfico Turnos por Médico
  barMedicoData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Turnos por médico' }]
  };


  barMedicoOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y' // barras horizontales
  };

  // Datos para la tabla
  turnosPorMedico: any[] = [];
  filteredMedicos: any[] = [];

  // Paginación
  paginaActual = 1;
  itemsPorPagina = 5;
  paginasTotales = 1;

  // Texto para búsqueda
  filtroNombre = '';

  constructor(private reporteService: ReportesService) { }

  ngOnInit(): void {
    const colores = [
      '#4dc9f6', '#f67019', '#f53794', '#537bc4',
      '#acc236', '#166a8f', '#00a950', '#58595b',
      '#8549ba'
    ];


    this.reporteService.obtenerEstadisticas().subscribe({
      next: (data: any) => {
        this.pacientes = data.pacientes;
        this.secretarias = data.secretarias;
        this.medicos = data.medicos;
        this.turnos = data.turnos;


        this.barChartData = {
          labels: data.turnosPorEspecialidad.map((e: any) => e.nombre),
          datasets: [{
            data: data.turnosPorEspecialidad.map((e: any) => e.cantidad),
            label: 'Turnos por especialidad',
            backgroundColor: data.turnosPorEspecialidad.map((_: any, i: number) => colores[i % colores.length])


          }]
        };
      },
      error: err => console.error('Error al cargar estadísticas:', err)
    });


    this.reporteService.obtenerTurnosPorMedico().subscribe({
      next: (data: any) => {
        console.log('Turnos por médico:', data);
        this.barMedicoData = {
          labels: data.map((e: any) => e.nombre),
          datasets: [{
            data: data.map((e: any) => e.cantidad),
            label: 'Turnos por médico',
            backgroundColor: data.map((_: any, i: number) => colores[i % colores.length])
          }]
        };
      },
      error: err => console.error('Error al cargar turnos por médico:', err)
    });


    this.reporteService.obtenerTurnosPorMedico().subscribe({
      next: (data: any) => {
        this.turnosPorMedico = data;
        this.aplicarFiltroYPaginacion();
      },
      error: err => console.error('Error al cargar turnos por médico:', err)
    });
  }


  aplicarFiltroYPaginacion() {
    // Filtrar por nombre
    let medicosFiltrados = this.turnosPorMedico.filter(m =>
      m.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );


    // Calcular cantidad de páginas
    this.paginasTotales = Math.ceil(medicosFiltrados.length / this.itemsPorPagina);


    // Obtener datos de la página actual
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.filteredMedicos = medicosFiltrados.slice(inicio, fin);
  }


  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 1 || nuevaPagina > this.paginasTotales) return;
    this.paginaActual = nuevaPagina;
    this.aplicarFiltroYPaginacion();
  }


  // Llamar esta función cuando el filtro cambie
  onFiltroChange() {
    this.paginaActual = 1;
    this.aplicarFiltroYPaginacion();
  }


}

