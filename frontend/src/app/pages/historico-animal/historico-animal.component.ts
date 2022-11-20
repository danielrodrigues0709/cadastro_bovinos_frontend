import { Component, Input, OnInit } from '@angular/core';
import { Animal } from 'src/app/interfaces/animal';

@Component({
  selector: 'app-historico-animal',
  templateUrl: './historico-animal.component.html',
  styleUrls: ['./historico-animal.component.scss']
})
export class HistoricoAnimalComponent implements OnInit {

  @Input() data!: Animal;

  constructor() { }

  ngOnInit(): void {
  }

}
