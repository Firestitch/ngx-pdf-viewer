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
import { takeUntil } from 'rxjs/operators';
import { FieldInputComponent } from '../field-input';
import { initField } from '../../helpers';
import { FieldService } from '../../services';


@Component({
  selector: 'fs-pdf-form',
  templateUrl: 'pdf-form.component.html',
  styleUrls: [ 'pdf-form.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FieldService],
})
export class FsPdfFormComponent implements OnInit, OnDestroy {

  @ViewChild(FsPdfViewerComponent)
  public pdfViewer: FsPdfViewerComponent;

  @ViewChild(FieldInputComponent)
  public fieldInput: FieldInputComponent;

  @Input() public pdf;
  @Input() public height;
  @Input() public name;

  public started = false;
  public complete = 1;
  public total = 1;
  public field: Field;

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
    private _fieldService: FieldService,
  ) {}

  public ngOnInit(): void {
    this._fieldService.field$
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((field: Field) => {
      this.field = field;
      if(this.fieldInput) {
        this.fieldInput.focus();
      }

      this._cdRef.markForCheck();
    });
  }

  public get el(): any {
   return this._el.nativeElement;
  }

  public pageRendered(event: PageRenderedEvent): void {
    setTimeout(() => {
      const data = this.pdfViewer.getFormData()
      .subscribe((fields) => {

        const indexes = [ ... this.el.querySelectorAll(`.textWidgetAnnotation`)]
        .reduce((accum, el, index) => {
          return {
            ...accum,
            [el.getAttribute('data-annotation-id')]: index,
          };
        }, {});

        fields.forEach((data: { pageNumber: number, fieldAnnotation: FieldAnnotation }) => {
          const fieldAnnotation = data.fieldAnnotation;
          const annotation = this.el.querySelector(`.page[data-page-number="${data.pageNumber}"] .textWidgetAnnotation[data-annotation-id="${fieldAnnotation.id}"]:not(.processed)`);

          if(annotation) {
            const field = initField(fieldAnnotation, indexes);
            
            annotation.classList.add('processed');
            const injector = Injector.create({
              parent: this._injector,
              providers: [
                {
                  provide: 'fieldService',
                  useValue: this._fieldService,
                },
                {
                  provide: 'field',
                  useValue: field,
                },
              ],
            });

            const componentPortal = new ComponentPortal(FieldComponent, null, injector);
            const domPortalOutlet = new DomPortalOutlet(
              annotation,
              this._componentFactoryResolver,
              this._appRef,
              this._injector,
            );

            const componentRef = domPortalOutlet.attach(componentPortal);
            this._fieldService.init(field, componentRef.instance);
          }
        });
      });
    });
  }
  
  public startClick(): void {
    this.started = true;
    this._fieldService.field = this._fieldService.getFirstField();
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
