import { Component } from '@angular/core';
import { MegaMenuItem, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
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
export class AppComponent {

  title = 'frontend';
  items: MegaMenuItem[] = [];
  userOptions: MenuItem[] = [];
  loggedIn!: boolean;
  tokenStr = localStorage.getItem('token');
  userName!: string;
  user!: Usuario;
  userStr = localStorage.getItem('user');
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private config: PrimeNGConfig,
    public dialogService: DialogService,
    private _authService: AuthService
  ) {
    if(this.tokenStr && this.userStr) {
      this.loggedIn = this.tokenStr ? true : false;
      this.user = JSON.parse(this.userStr);
      this.userName = this.user.nome_usuario;
    }
  }

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
    this.updateUser();
  }

  updateUser(): void {
    this._authService.user.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.user = res;
      this.userName = res.nome_usuario;
    });
  }

  myAccont(): void {
    const ref = this.dialogService.open(EdicaoUsuarioComponent, {
      data: this.user,
      header: `Editar Dados Usuário`,
      width: '80%'
    });
  }

  logOut(): void {
    this._authService.logOut();
    window.location.reload();
  }
  
  onSubscriptionsDestroy(ngUnsubscribe: Subject<any>): void {
    ngUnsubscribe.next(true);
	  ngUnsubscribe.complete();
	  ngUnsubscribe.unsubscribe();
	}

	ngOnDestroy(): void {
	  this.onSubscriptionsDestroy(this.ngUnsubscribe);
	}
}
