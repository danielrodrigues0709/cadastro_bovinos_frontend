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
      {label: 'Plantel', icon: 'pi pi-fw pi-angle-right', routerLink: 'animais'},
      {label: 'Medicamentos', icon: 'pi pi-fw pi-angle-right', routerLink: 'medicamentos'},
      {label: 'Vacinas/Vermífugos', icon: 'pi pi-fw pi-angle-right', routerLink: 'vacinas'},
      {label: 'Vacinações', icon: 'pi pi-fw pi-angle-right', routerLink: 'vacinacoes'},
      {label: 'Inseminações', icon: 'pi pi-fw pi-angle-right', routerLink: 'inseminacoes'},
      {label: 'Partos', icon: 'pi pi-fw pi-angle-right', routerLink: 'partos'},
      {label: 'Ocorrências', icon: 'pi pi-fw pi-angle-right', routerLink: 'ocorrencias'},
    ];
  }
}
