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
  Output,
  EventEmitter,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { MatSidenavContent } from '@angular/material/sidenav';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PageRenderedEvent } from 'ngx-extended-pdf-viewer';

import { FieldComponent } from '../field';
import { FsPdfViewerComponent } from '../../../pdf-viewer/components/pdf-viewer';
import { Field, FieldAnnotation } from '../../interfaces';
import { FieldInputComponent } from '../field-input';
import { initField } from '../../helpers';
import { FieldService } from '../../services';
import { FieldType } from '../../enums';


@Component({
  selector: 'fs-pdf-form',
  templateUrl: 'pdf-form.component.html',
  styleUrls: [ 'pdf-form.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FieldService],
})
export class FsPdfFormComponent implements OnInit, OnDestroy {

  @ViewChild(MatSidenavContent, { static: true })
  public sidenavContent: MatSidenavContent;

  @ViewChild(FsPdfViewerComponent)
  public pdfViewer: FsPdfViewerComponent;

  @ViewChild(FieldInputComponent)
  public fieldInput: FieldInputComponent;

  @Input() public pdf;
  @Input() public name;
  @Input() public fields: { name: string, value: string }[] = [];

  @Output() public fieldChange = new EventEmitter<Field>();

  public started = false;
  public complete = 0;
  public total = 0;
  public completePercent = 0;
  public field: Field;
  public sidenav = {
    opened: false,
    mode: 'side',
  };

  private _destroy$ = new Subject();

  constructor(
    private _el: ElementRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _cdRef: ChangeDetectorRef,
    private _fieldService: FieldService,
  ) {}

  public ngOnInit(): void {  
    this._fieldService.containerEl = this.sidenavContent.getElementRef().nativeElement;  
    this._fieldService.field$
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((field: Field) => {
      this.field = field;
      this.sidenav.opened = !!field;
      this.complete = this._fieldService.complete; 
      this.completePercent = Math.round((this.complete/this.total) * 100) || 0;
      this.total = this._fieldService.total;
      this._cdRef.markForCheck();
    });
    
    this._fieldService.fieldChange$
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((field: Field) => {
      this.fieldChange.next(field);
    });
  }

  public get el(): any {
   return this._el.nativeElement;
  }

  public pageRendered(event: PageRenderedEvent): void {
    setTimeout(() => {
      const data = this.pdfViewer.getFormData()
      .subscribe((formFields: { pageNumber: number, fieldAnnotation: FieldAnnotation }[]) => {

        const fields: Field[] = formFields
        .filter((formField) => formField.pageNumber === event.pageNumber)
        .map((formField) => initField(formField.fieldAnnotation))
        .reduce((accum, field: Field) => {
          if(field.type === FieldType.RadioButton) {
            const radioButtonField: Field = accum.find((fieldItem) => field.name === fieldItem.name);
            if(radioButtonField) {
              radioButtonField.optionValues = [
                ...radioButtonField.optionValues,
                ...field.optionValues
              ];

            } else {
              accum = [
                ...accum,
                {
                  ...field,
                }
              ];
            }
          } else {
            accum = [
              ...accum,
              field
            ];
          }

          return accum;
        },[])
        .sort((a, b) => a.index - b.index);

        fields.forEach((field) => {
          if(field.value === null) {
            const valueField = this.fields.find((item) => item.name === field.name);

            if(valueField) {
              field.value = valueField.value;
            }
          }

          switch(field.type) {
            case FieldType.Checkbox:
            case FieldType.RadioButton:
              field.optionValues
              .forEach((optionValue) => {
                const selector = `.page[data-page-number="${event.pageNumber}"] .buttonWidgetAnnotation[data-annotation-id="${optionValue.id}"]:not(.processed)`;
                this.createComponent(field, selector, optionValue);
              });

            break;

            default: 
              const selector = `.page[data-page-number="${event.pageNumber}"] .textWidgetAnnotation[data-annotation-id="${field.id}"]:not(.processed)`;
              this.createComponent(field, selector, null);
          }
        });
      });
    });
  }

  public createComponent(field: Field, selector, optionValue): void {
    const annotation = this.el.querySelector(selector);
          
    if(annotation) {
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
          {
            provide: 'optionValue',
            useValue: optionValue,
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
  }
  
  public startClick(): void {
    this.started = true;
    this.sidenav.opened = true;
    this._fieldService.selectField = this._fieldService.getFirstField();
    setTimeout(() => {
      this.pdfViewer.resize();
    });
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
