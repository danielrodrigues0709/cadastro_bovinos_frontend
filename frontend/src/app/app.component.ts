import { Component } from '@angular/core';
import { MegaMenuItem, MenuItem, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  items: MegaMenuItem[] = [];
  userOptions: MenuItem[] = [];

  constructor(private config: PrimeNGConfig) {}

  ngOnInit() {
    this.config.setTranslation({
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      clear: 'Limpar'
    });

    this.items = [
      {label: 'Plantel', icon: 'pi pi-fw pi-angle-right', routerLink: 'animais'},
      {label: 'Medicamentos', icon: 'pi pi-fw pi-angle-right', routerLink: 'medicamentos'},
      {label: 'Vacinas/Vermífugos', icon: 'pi pi-fw pi-angle-right', routerLink: 'vacinas'},
      {label: 'Vacinações/Vermifugações', icon: 'pi pi-fw pi-angle-right', routerLink: 'vacinacoes'},
      {label: 'Inseminações', icon: 'pi pi-fw pi-angle-right', routerLink: 'inseminacoes'},
      {label: 'Partos', icon: 'pi pi-fw pi-angle-right', routerLink: 'partos'},
      {label: 'Ocorrências', icon: 'pi pi-fw pi-angle-right', routerLink: 'ocorrencias'},
    ];

    this.userOptions = [
      
    ]
  }
}
