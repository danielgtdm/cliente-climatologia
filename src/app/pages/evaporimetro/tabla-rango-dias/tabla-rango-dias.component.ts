import { Component, OnInit } from '@angular/core';
import { NbGetters, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbDialogService } from '@nebular/theme';

import { ConsultandoComponent } from 'src/app/pages/dialogs/consultando/consultando.component';
import { RegistrosNoEncontradosComponent } from 'src/app/pages/dialogs/registros-no-encontrados/registros-no-encontrados.component';

import { Registro } from 'src/app/models/registro';

import { RegistroService } from 'src/app/services/registro.service';
import { ExcelService } from 'src/app/services/excel.service';
import { CsvService } from 'src/app/services/csv.service';

interface FSEntry {
  'Fecha': string;
  'Evaporamiento': number | string;
  childEntries?: FSEntry[];
  expanded?: boolean;
}

@Component({
  selector: 'app-tabla-rango-dias',
  templateUrl: './tabla-rango-dias.component.html',
  styleUrls: ['./tabla-rango-dias.component.scss']
})
export class TablaRangoDiasComponent implements OnInit {

  private fechas = new Array();
  private inicioRango = new Date();
  private finRango = new Date();
  private listaRegistros: Registro[] = [];
  private registrosNoEncontrados: Registro[] = [];
  private dialogoConsulta;

  customColumn = 'Fecha';
  defaultColumns = ['Evaporamiento'];
  allColumns = [this.customColumn, ...this.defaultColumns];
  source: NbTreeGridDataSource<FSEntry>;
  getters: NbGetters<FSEntry, FSEntry> = {
    dataGetter: (node: FSEntry) => node,
    childrenGetter: (node: FSEntry) => node.childEntries || undefined,
    expandedGetter: (node: FSEntry) => !!node.expanded,
  };

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private registroService: RegistroService,
    private excelService: ExcelService,
    private csvService: CsvService,
    private dialogService: NbDialogService
  ) {
    this.source = dataSourceBuilder.create([], this.getters);
  }


  ngOnInit() {
  }

  private getDateList() {
    this.fechas = new Array();
    var aux = this.inicioRango;
    this.fechas.push([new Date(+aux)]);

    do{
      aux.setDate(aux.getDate() + 1);
      this.fechas.push([new Date(+aux)]);
    }while(aux < this.finRango)

    return this.fechas;
  }

  public exportarExcel() {
    if(this.listaRegistros.length == 0){
      alert('Primero debes seleccionar un rango de fechas');
    }else{
      this.excelService.generateEvaporimetroExcel(this.listaRegistros);
    }
  }

  public exportarCSV() {
    if(this.listaRegistros.length == 0){
      alert('Primero debes seleccionar un rango de fechas');
    }else{
      this.csvService.generateEvaporimetroCSV(this.listaRegistros);
    }
  }

  public selectedDate(event: any) {

    if (event.end != null) {
      this.dialogoConsulta = this.dialogService.open(ConsultandoComponent);
      this.inicioRango = event.start as Date;
      this.finRango = event.end as Date;
      this.getDataInRange();
    }

  }

  private async getDataInRange() {
    this.listaRegistros = [];
    this.registrosNoEncontrados = [];
    var lista = this.getDateList();

    for (let i = 0; i < lista.length; i++) {
      const day = lista[i] as Date;
      let reg = new Registro();
      reg.fecha = day;
      const promesa = await this.registroService.getRegistroByFecha(reg).toPromise()
      .catch(err => {
      });

      promesa ? 
        this.listaRegistros.push(promesa.payload as Registro) : this.listaRegistros.push(this.registroNoEncontrado(reg));   
    }

    this.viewDataTable(this.listaRegistros);
  }

  private viewDataTable(listaRegistros: Registro[]) {
    const registros = listaRegistros;
    var data: FSEntry[] = [];

    for (let i = 0; i < registros.length; i++) {
      const registro = registros[i];

      const fecha = registro.fecha ?
        registro.fecha.toString().substring(0, 10) : 'Fecha No Registrada';
     
      data.push({
        'Fecha': fecha,
        'Evaporamiento': registro.evaporamiento != null ? `${registro.evaporamiento}` : 'No Registrado'
      });
    }

    this.source = this.dataSourceBuilder.create(data, this.getters);
    this.dialogoConsulta.close();
    this.registrosNoEncontrados.length > 0 ? this.dialogoRegistrosNoEncontrados() : ()=>{} ;
  }

  private registroNoEncontrado(reg: Registro) : Registro{
    this.registrosNoEncontrados.push(reg);
    var registroNoEncontrado = new Registro();

    return registroNoEncontrado;
  }

  private dialogoRegistrosNoEncontrados(){
    this.dialogService.open(RegistrosNoEncontradosComponent, {context: { registros: this.registrosNoEncontrados}});
  }

}
