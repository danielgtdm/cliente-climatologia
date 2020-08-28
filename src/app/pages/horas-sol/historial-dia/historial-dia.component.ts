import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { RegistroService } from 'src/app/services/registro.service';
import { Registro } from 'src/app/models/registro';

import { NbDialogService } from '@nebular/theme';
import { ConsultandoComponent } from 'src/app/pages/dialogs/consultando/consultando.component';
import { RegistrosNoEncontradosComponent } from 'src/app/pages/dialogs/registros-no-encontrados/registros-no-encontrados.component';

@Component({
  selector: 'app-historial-dia',
  templateUrl: './historial-dia.component.html',
  styleUrls: ['./historial-dia.component.scss']
})
export class HistorialDiaComponent implements OnInit {

  private fechas = [];
  private dia = new Date();
  private data = [];
  private fechaBuscar = new Date();
  private listaRegistros = [];
  private registrosNoEncontrados: Registro[] = [];
  private dialogoConsulta;

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Horas de Sol', yAxisID: 'y-axis-1' }
  ];
  public lineChartLabels: Label[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'Jueves',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'Mitad del Periodo'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // horas sol
      backgroundColor: 'rgba(0,131,0,0.5)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(
    public registroService: RegistroService,
    private dialogService: NbDialogService
  ) { }

  ngOnInit() {
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  private getDateList(){
    const today = new Date();
    this.fechas = new Array();
    var aux = this.dia;
    this.fechas.push([new Date(+aux)]);

    do{
      aux.setFullYear(aux.getFullYear() + 1);
      this.fechas.push([new Date(+aux)]);
    }while(aux.getFullYear() < today.getFullYear())

    return this.fechas;
  }

  async selectedDate(event: any) {
    this.dialogoConsulta = this.dialogService.open(ConsultandoComponent);
    this.dia = event as Date;
    this.dia.setFullYear(1989);
    this.getDataInRange();
}
  
  async getDataInRange() {
    this.registrosNoEncontrados = [];
    this.listaRegistros = [];
    const lista = this.getDateList();

    for (let i = 0; i < lista.length; i++){
      const day = lista[i] as Date;
      let reg = new Registro();
      reg.fecha = day;
      const promesa = await this.registroService.getRegistroByFecha(reg).toPromise()
      .catch(err => {
	//handle errors
      });

      promesa ? 
	this.listaRegistros.push(promesa.payload as Registro) : this.registrosNoEncontrados.push(reg);
    }
    this.viewDataGraphics(this.listaRegistros);
  }



  private viewDataGraphics(listaRegistros: Registro[]) {
    var registros = listaRegistros;
    var HS = [];
    var labels = [];

    for (let i = 0; i < registros.length; i++) {
      const registro = registros[i];
      const horasSol = registro.horas_sol;
      const fecha = `${registro.fecha}`;
      HS.push(horasSol);
      labels.push(fecha.substring(0, 10));
    }

    this.lineChartLabels = labels;
    for (let i = 0; i < this.lineChartData.length; i++) {
      if (i == 0) {
        this.lineChartData[i].data = HS;
      }
    }

    this.chart.update();
    this.dialogoConsulta.close();
    
    this.registrosNoEncontrados.length > 0 ? 
      this.dialogoRegistrosNoEncontrados() : ()=>{} ;
  }

  private dialogoRegistrosNoEncontrados(){
    this.dialogService.open(RegistrosNoEncontradosComponent, { context: { registros: this.registrosNoEncontrados}});
  }


}
