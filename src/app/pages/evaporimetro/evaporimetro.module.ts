import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaporimetroComponent } from './evaporimetro.component';
import { GraficoRangoDiasComponent } from './grafico-rango-dias/grafico-rango-dias.component';
import { GraficoRangoMesesComponent } from './grafico-rango-meses/grafico-rango-meses.component';
import { GraficoRangoAniosComponent } from './grafico-rango-anios/grafico-rango-anios.component';
import { TablaRangoDiasComponent } from './tabla-rango-dias/tabla-rango-dias.component';

import { EvaporimetroRoutingModule } from './evaporimetro-routing.module';

import { NbDatepickerModule } from '@nebular/theme';
import { NbTreeGridModule } from '@nebular/theme';
import { NbCardModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    EvaporimetroComponent, 
    GraficoRangoDiasComponent, 
    GraficoRangoMesesComponent, 
    GraficoRangoAniosComponent, 
    TablaRangoDiasComponent
  ],
  imports: [
    CommonModule,
    EvaporimetroRoutingModule,
    NbCardModule,
    NbDatepickerModule,
    NbTreeGridModule,
    ChartsModule,
    NbButtonModule
  ]
})
export class EvaporimetroModule { }
