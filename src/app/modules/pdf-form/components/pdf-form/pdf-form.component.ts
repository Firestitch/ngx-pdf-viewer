import {
  Component,
  Input,
  OnInit,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  ChangeDetectorRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { MatSidenavContent } from '@angular/material/sidenav';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PageRenderedEvent } from 'ngx-extended-pdf-viewer';

import { FieldComponent } from '../field/field.component';
import { FsPdfViewerComponent } from '../../../pdf-viewer/components/pdf-viewer';
import { PdfField } from '../../interfaces';
import { Field } from '../../classes';
import { FieldInputComponent } from '../field-input/field-input.component';
import { FieldService } from '../../services';
import { FieldType } from '../../enums';
import { initFields } from '../../helpers/init-fields';


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
  @Input() public fields: PdfField[] = [];
  @Input() public actions: { label?: string, click?: () => any, color?: string }[] = [];

  @Output() public fieldChanged = new EventEmitter<Field>();
  @Output() public closed = new EventEmitter();
  @Output() public finished = new EventEmitter();
  @Output() public started = new EventEmitter();

  public hasStarted = false;
  public zoom = 100;
  public field: Field;
  public sidenav: any = {
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
      this._cdRef.markForCheck();
    });
    
    this._fieldService.fieldChanged$
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((field: Field) => {
      this.fieldChanged.next(field);
    });

    this._fieldService.finished$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.finished.emit();
      });
      
    this.started
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.hasStarted = true;
        this.sidenav.opened = true;
        this._fieldService.selectField = this._fieldService.getFirstField();
        setTimeout(() => {
          this.pdfViewer.resize();
        });
      });
  }

  public get el(): any {
   return this._el.nativeElement;
  }

  public pageRendered(event: PageRenderedEvent): void {
    const scale = event.source.viewport.scale;
    const page = event.source.div;

    const fieldContainerEl = document.createElement('div');
    fieldContainerEl.classList.add('field-container');

    page.append(fieldContainerEl);

    this.fields
    .filter((field) => field.pageNumber === event.pageNumber)
    .reduce(initFields, [])
    .sort((a,b) => a.index - b.index)
    .forEach((field: any) => {
        const fieldEl = this.createElement(page, scale, field.top, field.left, field.width, field.height);
        this.createComponent(field, fieldEl, null);
    });
  }
  
  public createElement(page, scale, top, left, width, height) {
    const fieldEl = document.createElement('div');
    fieldEl.classList.add('field-container-field');
    fieldEl.style.top = `${(top * 72 * scale)}px`;
    fieldEl.style.left = `${(left * 72 * scale)}px`;
    fieldEl.style.width = `${(width * 72 * scale)}px`;
    fieldEl.style.height = `${(height * 72 * scale)}px`;

    page.append(fieldEl);

    return fieldEl;
  }

  public createComponent(field: Field, el, optionValue): void {
    el.classList.add('processed');
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
      el,
      this._componentFactoryResolver,
      this._appRef,
      this._injector,
    );

    domPortalOutlet.attach(componentPortal);      
  }

  public zoomIn(): void {
    this.zoom += 20;
  }
  
  public zoomOut(): void {
    this.zoom -= 20;
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
