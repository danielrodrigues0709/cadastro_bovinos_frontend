import { Component, OnInit } from '@angular/core';
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
  selectedNode!: TreeNode;
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

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _animaisService: AnimaisService
  ) { }

  ngOnInit(): void {
    this.getAnimalById();

    this.fillOutFamilyTree2(this.config.data.animal)
  }

  fillOutFamilyTree2(animal: Animal, node?: any): void {
    node = [{
      data: animal,
      expanded: true,
      type: 'animal',
    }];

    if(animal.id_reprodutor) {
      this._animaisService.getAnimalById(animal.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        node?.children.push(res.rows[0]);
      });
    }
    if(animal.id_mae) {
      this._animaisService.getAnimalById(animal.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        node?.children.push(res.rows[0]);
      });
    }
    if(node.data) {
      node?.children.forEach((element: Animal) => {
        this.fillOutFamilyTree2(element)
      });
    }

    console.log(node);
    
  }

  fillOutFamilyTree(): void {
    this.familyTree = [{
      data: this.config.data.animal,
      expanded: true,
      type: 'animal',
      children: [{
        data: this.reprodutor,
        expanded: true,
        type: 'animal',
        children: [{
          data: this.avo_paterno,
          expanded: true,
          type: 'animal',
          children: [{
            data: this.bisavo_paterno1,
            expanded: true,
            type: 'animal',
          },{
            data: this.bisavo_paterna1,
            expanded: true,
            type: 'animal',
          }]
        },{
          data: this.avo_paterno,
          expanded: true,
          type: 'animal',
          children: [{
            data: this.bisavo_materno1,
            expanded: true,
            type: 'animal',
          },{
            data: this.bisavo_materna1,
            expanded: true,
            type: 'animal',
          }]
        }]
      },{
        data: this.mae,
        expanded: true,
        type: 'animal',
        children: [{
          data: this.avo_materno,
          expanded: true,
          type: 'animal',
          children: [{
            data: this.bisavo_materno1,
            expanded: true,
            type: 'animal',
          },{
            data: this.bisavo_materna1,
            expanded: true,
            type: 'animal',
          }]
        },{
          data: this.avo_materna,
          expanded: true,
          type: 'animal',
          children: [{
            data: this.bisavo_materno2,
            expanded: true,
            type: 'animal',
          },{
            data: this.bisavo_materna2,
            expanded: true,
            type: 'animal',
          }]
        }]
      }]
    }];
    console.log(this.familyTree);
    
  }

  getAnimalById(): void {
    if(this.config.data.animal.reprodutor) {
      this.reprodutor = this.config.data.animal.reprodutor;
      if(this.reprodutor.id_reprodutor) {
        this._animaisService.getAnimalById(this.reprodutor.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          this.avo_paterno = res.rows[0];
          if(this.avo_paterno.id_reprodutor) {
            this._animaisService.getAnimalById(this.avo_paterno.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
              this.bisavo_paterno1 = res.rows[0];
            });
          }
          if(this.avo_paterno.id_mae) {
            this._animaisService.getAnimalById(this.avo_paterno.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
              this.bisavo_paterna1 = res.rows[0];
            });
          }
        });
      }
      if(this.reprodutor.id_mae) {
        this._animaisService.getAnimalById(this.reprodutor.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          this.avo_paterna = res.rows[0];
          if(this.avo_paterna.id_reprodutor) {
            this._animaisService.getAnimalById(this.avo_paterna.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
              this.bisavo_paterno2 = res.rows[0];
            });
          }
          if(this.avo_paterna.id_mae) {
            this._animaisService.getAnimalById(this.avo_paterna.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
              this.bisavo_paterna2 = res.rows[0];
            });
          }
        });
      }
    }
    if(this.config.data.animal.mae) {
      
      this.mae = this.config.data.animal.mae;
      if(this.mae.id_reprodutor) {
        this._animaisService.getAnimalById(this.mae.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          this.avo_materno = res.rows[0];
          if(this.avo_materno.id_reprodutor) {
            this._animaisService.getAnimalById(this.avo_materno.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
              this.bisavo_materno1 = res.rows[0];
            });
          }
          if(this.avo_materno.id_mae) {
            this._animaisService.getAnimalById(this.avo_materno.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
              this.bisavo_materna1 = res.rows[0];
            });
          }
        });
      }
      if(this.mae.id_mae) {
        this._animaisService.getAnimalById(this.mae.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          this.avo_materna = res.rows[0];
          if(this.avo_materna.id_reprodutor) {
            this._animaisService.getAnimalById(this.avo_materna.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
              this.bisavo_materno2 = res.rows[0];
            });
          }
          if(this.avo_materna.id_mae) {
            this._animaisService.getAnimalById(this.avo_materna.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
              this.bisavo_materna2 = res.rows[0];
            });
          }
        });
      }
    };
    
    this.fillOutFamilyTree();
  }

  onNodeSelect(event: any): void {
    console.log(event);
    
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