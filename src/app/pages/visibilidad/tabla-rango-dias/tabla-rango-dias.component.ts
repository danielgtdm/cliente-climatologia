import { Component, OnInit } from '@angular/core';
import { NbGetters, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { RegistroService } from 'src/app/services/registro.service';
import { Registro } from 'src/app/models/registro';
import { Visibilidad } from 'src/app/models/visibilidad';

interface FSEntry {
  fecha: string;
  h0830: number;
  h1400: number;
  h1800: number;
  childEntries?: FSEntry[];
  expanded?: boolean;
}

@Component({
  selector: 'app-tabla-rango-dias',
  templateUrl: './tabla-rango-dias.component.html',
  styleUrls: ['./tabla-rango-dias.component.scss']
})
export class TablaRangoDiasComponent implements OnInit {

  fechas = [];
  inicioRango = new Date();
  finRango = new Date();
  datos = [];
  listaRegistros = [];

  customColumn = 'Fecha';
  defaultColumns = ['08:30 hrs', '14:00 hrs', '18:00 hrs'];
  allColumns = [this.customColumn, ...this.defaultColumns];
  cast: NbTreeGridDataSourceBuilder<FSEntry>;
  source: NbTreeGridDataSource<FSEntry>;
  getters: NbGetters<FSEntry, FSEntry>;

  constructor(dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, public registroService: RegistroService) {
    const getters: NbGetters<FSEntry, FSEntry> = {
      dataGetter: (node: FSEntry) => node,
      childrenGetter: (node: FSEntry) => node.childEntries || undefined,
      expandedGetter: (node: FSEntry) => !!node.expanded,
    };
    this.source = dataSourceBuilder.create(this.data, getters);
    this.cast = dataSourceBuilder;
    this.getters = getters;
  }

  private data: FSEntry[] = [];
  private dataClean: FSEntry[] = [];

  ngOnInit() {
  }

  updateTable(listaRegistros: Registro[]) {
    
    //Limpiar tabla en caso de elegir otro rango
    this.data = this.dataClean; 

    var registros = listaRegistros;
    var aux_reg = new Registro();

    //Ordenar por fechas
    for (let i = 0; i < registros.length; i++) {
      for (let j = 0; j < registros.length - 1; j++) {
        var reg1 = registros[j] as Registro;
        var reg2 = registros[j + 1] as Registro;
        if (reg1.fecha > reg2.fecha) {
          aux_reg = registros[j];
          registros[j] = registros[j + 1];
          registros[j + 1] = aux_reg;
        }
      }
    }

    //extraer datos
    for (let i = 0; i < registros.length; i++) {
      const registro = registros[i];
      var vis = registro.Visibilidad as Visibilidad;
      var fecha = `${registro.fecha}`;
      var dato: FSEntry = {
        fecha: fecha,
        h0830: vis.h0830,
        h1400: vis.h1400,
        h1800: vis.h1800,
        childEntries: []     
      };
      this.data.push(dato);
    }

    //reconstruir tabla
    this.source = this.cast.create(this.data, this.getters);
  }

  async selectedDate(event: any) {

    if (event.end != null) {
      this.inicioRango = event.start as Date;
      this.finRango = event.end as Date;
      this.getDataInRange();
    }

  }

  async getDataInRange() {
    while (this.inicioRango.getDate() <= this.finRango.getDate()) {
      var regbyf = new Registro();
      regbyf.fecha = this.inicioRango;
      await this.registroService.getRegistroByFecha(regbyf).subscribe(r => {
        var registro = r.payload as Registro;
        this.listaRegistros.push(registro);
        this.updateTable(this.listaRegistros);        
      });
      this.inicioRango.setDate((this.inicioRango.getDate() + 1));
    }
  }

}
