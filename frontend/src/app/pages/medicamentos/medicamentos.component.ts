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

  listaMedicamentos(): void {
    this.medicamentosService.listMedicamentos().subscribe(res => {
      console.log('Teste', res); // TODO Implementar lógica
    });
  }

}
