import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NubosidadRoutingModule } from './nubosidad-routing.module';
import { GraficoRangoDiasComponent } from './grafico-rango-dias/grafico-rango-dias.component';
import { GraficoRangoMesesComponent } from './grafico-rango-meses/grafico-rango-meses.component';
import { GraficoRangoAniosComponent } from './grafico-rango-anios/grafico-rango-anios.component';
import { NubosidadComponent } from './nubosidad.component';

import { NbCardModule } from '@nebular/theme';
import { NbDatepickerModule } from '@nebular/theme';
import { NbTreeGridModule } from '@nebular/theme';

import { ChartsModule } from 'ng2-charts';
import { TablaRangoDiasComponent } from './tabla-rango-dias/tabla-rango-dias.component';

@NgModule({
  declarations: [GraficoRangoDiasComponent, GraficoRangoMesesComponent, GraficoRangoAniosComponent, NubosidadComponent, TablaRangoDiasComponent],
  imports: [
    CommonModule,
    NubosidadRoutingModule,
    NbCardModule,
    NbDatepickerModule,
    NbTreeGridModule,
    ChartsModule
  ]
})
export class NubosidadModule { }
