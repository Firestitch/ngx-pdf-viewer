import {
  Component,
  Input,
  OnInit,
  ElementRef,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PageRenderedEvent } from 'ngx-extended-pdf-viewer';
import { FieldComponent } from '../field';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { FsPdfViewerComponent } from '../../../pdf-viewer/components/pdf-viewer';
import { BehaviorSubject, Subject } from 'rxjs';
import { Field, FieldAnnotation } from '../../interfaces';



@Component({
  selector: 'fs-pdf-form',
  templateUrl: 'pdf-form.component.html',
  styleUrls: [ 'pdf-form.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsPdfFormComponent implements OnInit, OnDestroy {

  @ViewChild(FsPdfViewerComponent)
  public pdfViewer: FsPdfViewerComponent;

  @Input() public pdf;
  @Input() public height;
  @Input() public name;

  public started = false;
  public complete = 1;
  public total = 1;
  public field$ = new BehaviorSubject<Field>(null);

  private _destroy$ = new Subject();

  constructor(
    private _element: ElementRef,
    @Inject(DOCUMENT)
    private _document: Document,
    private _el: ElementRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    // this._fieldSelect$
    // .pipe(
    //   takeUntil(this._destroy$),
    // )
    // .subscribe((fieldAnnotation: FieldAnnotation) => {
    //   debugger;
    // });
  }

  public get el(): any {
   return this._el.nativeElement;
  }

  public pageRendered(event: PageRenderedEvent): void {
    setTimeout(() => {

      const data = this.pdfViewer.getFormData()
      .subscribe((fields) => {

        fields.forEach((data: { pageNumber: number, fieldAnnotation: FieldAnnotation }) => {
          const fieldAnnotation = data.fieldAnnotation;
          const annotation = this.el.querySelector(`.page[data-page-number="${data.pageNumber}"] .textWidgetAnnotation[data-annotation-id="${fieldAnnotation.id}"]:not(.processed)`);

          if(annotation) {
            const field: Field = {
              name: fieldAnnotation.fieldName,
              description: fieldAnnotation.alternativeText,
              type: 'input',
              value: data.fieldAnnotation.fieldValue,
              id: fieldAnnotation.id,  
            };
  
            fieldAnnotation.fieldName.split('|')
            .forEach((part) => {
              const index = part.indexOf(':');             
              if(index === -1) {
                switch(part) {
                  case 'name':
                    field.numeric = true;
                    break;                  

                  default:
                    field.name = part;
                }
              } else {
                const value = part.substring(index + 1);
                switch(part.substring(0,index)) {
                  case 'name':
                    field.name = value;
                    break;
                    
                    case 'label':
                      field.label = value;
                      break;
                  
                    case 'type':
                      field.type = value as any;
                      break;
                }
                
                
              }
            });

            
            annotation.classList.add('processed');
            const injector = Injector.create({
              parent: this._injector,
              providers: [
                {
                  provide: 'field',
                  useValue: field,
                },
                {
                  provide: 'fieldSelect$',
                  useValue: this.field$,
                },
              ],
            });

            const componentPortal = new ComponentPortal(FieldComponent, null, injector);

            const domPortalOutlet = new DomPortalOutlet(
              annotation,
              this._componentFactoryResolver,
              this._appRef,
              this._injector,
            ).attach(componentPortal);

            // //this._signInputComponents.push(domPortalOutlet.instance);

            annotation.querySelectorAll('input')
            .forEach((el) => el.remove());
          }
        });
      });
    });
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
