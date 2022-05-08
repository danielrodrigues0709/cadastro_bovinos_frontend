import { Component, OnInit } from '@angular/core';
import { AnimaisService } from 'src/app/services/animais.service';
import { Animal } from '../../interfaces/animal';

@Component({
  selector: 'app-plantel',
  templateUrl: './plantel.component.html',
  styleUrls: ['./plantel.component.scss']
})
export class PlantelComponent implements OnInit {

  animais: Animal[] = [];

  constructor(private animaisService: AnimaisService) { }

  ngOnInit() {
      this.animaisService.getAnimais().pipe().subscribe(res => {
        this.animais = res.rows;
      });
  }

}
