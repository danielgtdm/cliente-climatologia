import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeotermometrosRoutingModule } from './geotermometros-routing.module';
import { GeotermometrosComponent } from './geotermometros.component';
import { GraficoRangoDiasComponent } from './grafico-rango-dias/grafico-rango-dias.component';

import { NbCardModule } from '@nebular/theme';
import { NbDatepickerModule } from '@nebular/theme';
import { NbTreeGridModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';

import { ChartsModule } from 'ng2-charts';
import { TablaRangoDiasComponent } from './tabla-rango-dias/tabla-rango-dias.component';

@NgModule({
  declarations: [GeotermometrosComponent, GraficoRangoDiasComponent, TablaRangoDiasComponent],
  imports: [
    CommonModule,
    GeotermometrosRoutingModule,
    NbCardModule,
    NbDatepickerModule,
    NbTreeGridModule,
    ChartsModule,
    NbButtonModule
  ]
})
export class GeotermometrosModule { }
