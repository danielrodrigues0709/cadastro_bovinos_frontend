import { Component, OnInit } from '@angular/core';
import { MedicamentosService } from 'src/app/services/medicamentos.service';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.scss']
})
export class MedicamentosComponent implements OnInit {

  constructor(private medicamentosService: MedicamentosService) { }

  ngOnInit(): void {
  }

  salvaMedicamento(): void {
    this.medicamentosService.salvaMedicamento().subscribe(res => {
      console.log(res); // TODO Implementar lógica
    });
  }

  listaMedicamentos(): void {
    this.medicamentosService.listaMedicamentos().subscribe(res => {
      console.log(res); // TODO Implementar lógica
    });
  }

}
