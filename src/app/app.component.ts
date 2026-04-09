// src/app/app.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MegaMenuItem, PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from './interfaces/usuario';
import { EdicaoUsuarioComponent } from './pages/edicao-usuario/edicao-usuario.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService, MessageService]
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'agro-frontend';
  items: MegaMenuItem[] = [];
  loggedIn!: boolean;
  toggle: boolean = true;
  userName!: string;
  user!: Usuario;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private config: PrimeNGConfig,
    public dialogService: DialogService,
    private _authService: AuthService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    // Tradução PrimeNG — idêntico ao original
    this.config.setTranslation({
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      clear: 'Limpar'
    });

    // Menu — idêntico ao original
    this.items = [
      { label: 'Plantel',                   icon: 'pi pi-fw pi-angle-right', routerLink: 'animais' },
      { label: 'Medicamentos',              icon: 'pi pi-fw pi-angle-right', routerLink: 'medicamentos' },
      { label: 'Vacinas/Vermífugos',        icon: 'pi pi-fw pi-angle-right', routerLink: 'vacinas' },
      { label: 'Vacinações/Vermifugações',  icon: 'pi pi-fw pi-angle-right', routerLink: 'vacinacoes' },
      { label: 'Inseminações',              icon: 'pi pi-fw pi-angle-right', routerLink: 'inseminacoes' },
      { label: 'Partos',                    icon: 'pi pi-fw pi-angle-right', routerLink: 'partos' },
      { label: 'Ocorrências',               icon: 'pi pi-fw pi-angle-right', routerLink: 'ocorrencias' },
    ];

    this.listenToAuth();
  }

  // Unifica os dois subscribes do original em um só
  private listenToAuth(): void {
    this._authService.loggedIn
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(loggedIn => this.loggedIn = loggedIn);

    this._authService.user
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: Usuario) => {
        this.user = res;
        this.userName = res?.nome_usuario;
      });
  }

  myAccont(): void {
    // Idêntico ao original
    this.dialogService.open(EdicaoUsuarioComponent, {
      data: this.user,
      header: 'Editar Dados Usuário',
      width: '80%'
    });
  }

  async logOut(): Promise<void> {
    await this._authService.logOut();
    // navegação já feita dentro do AuthService
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.unsubscribe();
  }
}