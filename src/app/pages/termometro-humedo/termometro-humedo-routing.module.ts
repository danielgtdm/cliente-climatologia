import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermometroHumedoComponent } from './termometro-humedo.component';
import { GraficoRangoDiasComponent } from './grafico-rango-dias/grafico-rango-dias.component';
import { TablaRangoDiasComponent } from './tabla-rango-dias/tabla-rango-dias.component';

const routes: Routes = [{
    path: '',
    component: TermometroHumedoComponent,
    children: [
      {
        path: 'grafico-rango-dias',
        component: GraficoRangoDiasComponent
      },
      {
        path: 'tabla-rango-dias',
        component: TablaRangoDiasComponent
      }
    ]
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class TermometroHumedoRoutingModule {
  }