import { Component, OnInit } from '@angular/core';
import { Medicamento } from 'src/app/interfaces/Medicamento';
import { MedicamentosService } from 'src/app/services/medicamentos.service';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.scss']
})
export class MedicamentosComponent implements OnInit {

  medicamentos: Medicamento[] = [];

  constructor(private medicamentosService: MedicamentosService) { }

  ngOnInit() {
      this.medicamentosService.getMedicamentos().pipe().subscribe(res => {
        this.medicamentos = res.rows;
      });
  }

  edit(element: any): void {
    console.log(element)
  }

  delete(id: number): void {
    console.log(id)
  }

  include(): void {
    console.log("Novo")
  }

}
