import { Component } from '@angular/core';
import { MegaMenuItem,MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  items: MegaMenuItem[] = [];

  ngOnInit() {
    this.items = [
      {label: 'Plantel', icon: 'pi pi-fw pi-plus', routerLink: 'plantel'},
      {label: 'Animais', icon: 'pi pi-fw pi-download', routerLink: 'animais'},
      {label: 'Medicamentos', icon: 'pi pi-fw pi-download', routerLink: 'medicamentos'},
      {label: 'Vacinas/Vermífugos', icon: 'pi pi-fw pi-download', routerLink: 'vacinas'},
      {label: 'Partos', icon: 'pi pi-fw pi-download', routerLink: 'partos'},
      {label: 'Inseminações', icon: 'pi pi-fw pi-download', routerLink: 'inseminacoes'},
      {label: 'Ocorrências', icon: 'pi pi-fw pi-download', routerLink: 'ocorrencias'},
    ];
  }
}
