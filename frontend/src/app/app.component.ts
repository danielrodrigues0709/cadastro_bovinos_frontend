import { Component } from '@angular/core';
import { MegaMenuItem, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Usuario } from './interfaces/usuario';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
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
  isLoggedInStr = localStorage.getItem('isLoggedIn');
  userName!: string;
  user!: Usuario;
  userStr = localStorage.getItem('user');

  constructor(
    private config: PrimeNGConfig,
    public dialogService: DialogService,
    private _authService: AuthService
  ) {
    if(this.isLoggedInStr && this.userStr) {
      this.loggedIn = JSON.parse(this.isLoggedInStr);
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
  }

  myAccont(): void {
    const ref = this.dialogService.open(CadastroUsuarioComponent, {
      data: this.user,
      header: `Cadastrar Novo Usuário`,
      width: '80%'
    })
    .onClose.pipe().subscribe((edited: boolean) => {
      if(edited) {
        let userStr = localStorage.getItem('user');
        if(userStr) {
          this.user = JSON.parse(userStr);
          this.userName = this.user.nome_usuario;
        }
      }
    });
  }

  logOut(): void {
    this._authService.logOut();
    window.location.reload();
  }
}
