import { Component, OnInit, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Animal } from 'src/app/interfaces/animal';
import { AnimaisService } from 'src/app/services/animais.service';

@Component({
  selector: 'app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.scss']
})
export class FamilyTreeComponent implements OnInit {

  familyTree!: TreeNode[];
  reprodutor!: Animal;
  mae!: Animal;
  avo_paterno!: Animal;
  avo_paterna!: Animal;
  avo_materno!: Animal;
  avo_materna!: Animal;
  bisavo_paterno1!: Animal;
  bisavo_paterna1!: Animal;
  bisavo_paterno2!: Animal;
  bisavo_paterna2!: Animal;
  bisavo_materno1!: Animal;
  bisavo_materna1!: Animal;
  bisavo_materno2!: Animal;
  bisavo_materna2!: Animal;
  ngUnsubscribe: Subject<any> = new Subject<any>();
  onFamilyTreeUpdate$: Subject<any> = new Subject<any>();
  familyTreeUpdate = this.onFamilyTreeUpdate$.asObservable();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _animaisService: AnimaisService
  ) { }

  ngOnInit(): void {
    this.getAnimalById();
  }

  fillOutFamilyTree(): void {
    this.familyTree = [{
      data: this.config.data.animal,
      expanded: true,
      type: 'animal',
      styleClass: 'animal-card',

      children: 
      this.reprodutor || this.mae ? [
        this.reprodutor ? {
        data: this.reprodutor,
        expanded: true,
        type: 'animal',
        styleClass: 'animal-card',

        children: 
        this.avo_paterno || this.avo_paterna ? [
          this.avo_paterno ? {
          data: this.avo_paterno,
          expanded: true,
          type: 'animal',
          styleClass: 'animal-card',

          children: 
          this.bisavo_paterno1 || this.bisavo_paterna1 ? [
            this.bisavo_paterno1 ? {
            data: this.bisavo_paterno1,
            expanded: true,
            type: 'animal',
            styleClass: 'animal-card',
          } : {},
          this.bisavo_paterna1 ? {
            data: this.bisavo_paterna1,
            expanded: true,
            type: 'animal',
            styleClass: 'animal-card',
          } : {}
          ] : []
        } : {},
        this.avo_paterna ? {
          data: this.avo_paterna,
          expanded: true,
          type: 'animal',
          styleClass: 'animal-card',

          children: 
          this.bisavo_paterno2 || this.bisavo_paterna2 ? [{
            data: this.bisavo_paterno2,
            expanded: true,
            type: 'animal',
            styleClass: 'animal-card',
          },{
            data: this.bisavo_paterna2,
            expanded: true,
            type: 'animal',
            styleClass: 'animal-card',
          }] : []
        } : {}
        ] : []
      } : {},
      this.mae ? {
        data: this.mae,
        expanded: true,
        type: 'animal',
        styleClass: 'animal-card',

        children: 
        this.avo_materno || this.avo_materna ? [{
          data: this.avo_materno,
          expanded: true,
          type: 'animal',
          styleClass: 'animal-card',

          children: 
          this.bisavo_materno1 || this.bisavo_materna1 ? [{
            data: this.bisavo_materno1,
            expanded: true,
            type: 'animal',
            styleClass: 'animal-card',
          },{
            data: this.bisavo_materna1,
            expanded: true,
            type: 'animal',
            styleClass: 'animal-card',
          }] : []
        },{
          data: this.avo_materna,
          expanded: true,
          type: 'animal',
          styleClass: 'animal-card',

          children: 
          this.bisavo_materno2 || this.bisavo_materna2 ? [{
            data: this.bisavo_materno2,
            expanded: true,
            type: 'animal',
            styleClass: 'animal-card',
          },{
            data: this.bisavo_materna2,
            expanded: true,
            type: 'animal',
            styleClass: 'animal-card',
          }] : []
        }] : []
      } : {}] : []
    }];
  }

  getAnimalById(): void {
    if(this.config.data.animal.id_reprodutor) {
      this._animaisService.getAnimalById(this.config.data.animal.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.reprodutor = res.rows[0];
        this.onFamilyTreeUpdate$.next(this.reprodutor);
        if(this.reprodutor.id_reprodutor) {
          this._animaisService.getAnimalById(this.reprodutor.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.avo_paterno = res.rows[0];
            this.onFamilyTreeUpdate$.next(this.avo_paterno);
            if(this.avo_paterno.id_reprodutor) {
              this._animaisService.getAnimalById(this.avo_paterno.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.bisavo_paterno1 = res.rows[0];
                this.onFamilyTreeUpdate$.next(this.bisavo_paterno1);
              });
            }
            if(this.avo_paterno.id_mae) {
              this._animaisService.getAnimalById(this.avo_paterno.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.bisavo_paterna1 = res.rows[0];
                this.onFamilyTreeUpdate$.next(this.bisavo_paterna1);
              });
            }
          });
        }
        if(this.reprodutor.id_mae) {
          this._animaisService.getAnimalById(this.reprodutor.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.avo_paterna = res.rows[0];
            this.onFamilyTreeUpdate$.next(this.avo_paterna);
            if(this.avo_paterna.id_reprodutor) {
              this._animaisService.getAnimalById(this.avo_paterna.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.bisavo_paterno2 = res.rows[0];
                this.onFamilyTreeUpdate$.next(this.bisavo_paterno2);
              });
            }
            if(this.avo_paterna.id_mae) {
              this._animaisService.getAnimalById(this.avo_paterna.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.bisavo_paterna2 = res.rows[0];
                this.onFamilyTreeUpdate$.next(this.bisavo_paterna2);
              });
            }
          });
        }
      }
    )};
    if(this.config.data.animal.mae) {
      
      this.mae = this.config.data.animal.mae;
      if(this.mae.id_reprodutor) {
        this._animaisService.getAnimalById(this.mae.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.avo_materno = res.rows[0];
          this.onFamilyTreeUpdate$.next(this.avo_materno);
          if(this.avo_materno.id_reprodutor) {
            this._animaisService.getAnimalById(this.avo_materno.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.bisavo_materno1 = res.rows[0];
              this.onFamilyTreeUpdate$.next(this.bisavo_materno1);
            });
          }
          if(this.avo_materno.id_mae) {
            this._animaisService.getAnimalById(this.avo_materno.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.bisavo_materna1 = res.rows[0];
              this.onFamilyTreeUpdate$.next(this.bisavo_materna1);
            });
          }
        });
      }
      if(this.mae.id_mae) {
        this._animaisService.getAnimalById(this.mae.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.avo_materna = res.rows[0];
          this.onFamilyTreeUpdate$.next(this.avo_materna);
          if(this.avo_materna.id_reprodutor) {
            this._animaisService.getAnimalById(this.avo_materna.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.bisavo_materno2 = res.rows[0];
              this.onFamilyTreeUpdate$.next(this.bisavo_materno2);
            });
          }
          if(this.avo_materna.id_mae) {
            this._animaisService.getAnimalById(this.avo_materna.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {this.bisavo_materna2 = res.rows[0];
              this.onFamilyTreeUpdate$.next(this.bisavo_materna2);
            });
          }
        });
      }
    };
    
    this.familyTreeUpdate.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.fillOutFamilyTree();
    })
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
