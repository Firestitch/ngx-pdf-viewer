import {
  Component, ChangeDetectionStrategy,
  OnInit, ElementRef, OnDestroy, Inject, ChangeDetectorRef, HostBinding, HostListener,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

//import { parseLocal } from '@firestitch/date';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import {
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer';
import { Field } from '../../interfaces';

@Component({
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgxExtendedPdfViewerService],
})
export class FieldComponent implements OnInit, OnDestroy {

  @HostListener('click')
  public click() {
    this.select();
  }

  public layoutComponentValue: any;
  public subtype;
  public disabled = true;
  public checkboxIndex;
  public checkboxLabel;
  public configs;
  public value;

  private _destroy$ = new Subject();

  constructor(
    @Inject('field') private _field: Field,
    @Inject('fieldSelect$') private _fieldSelect: Subject<any>,
    private _el: ElementRef,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
  ) {
  }
  
  public select(): void {
    this._fieldSelect.next(this._field);
  }

  public ngOnInit(): void {
    // this.layoutComponent = this._layoutTemplateService
    //   .getLayoutComponentByName(this._name);

    // if(this.layoutComponent) {
    //   this.configs = this.layoutComponent.configs || {};
    //   this.layoutComponentValue = this._layoutTemplateService
    //     .getLayoutComponentValue(this.layoutComponent.id);

    //   this.subtype = this._layoutTemplateService
    //     .getLayoutComponentSubtype(this._name);

    //   switch(this.layoutComponent.type) {
    //     case LayoutComponentType.Acknowledgements:
    //       const match = this._name.match(/\d+$/);
    //       this.checkboxIndex = match[0];
    //       this.checkboxLabel = (this.configs.acknowledgements[this.checkboxIndex] || {}).label;
    //       this.layoutComponentValue.value.acknowledgements = this.layoutComponentValue.value?.acknowledgements || {};
    //       break;
    //     case LayoutComponentType.Signature:
    //       this.layoutComponentValue.value.date = parseLocal(this.layoutComponentValue.value?.date);
    //       break;
    //   }
    // }
  }

  public inputFocus() {
   // this._inputFocus$.next();

    // switch(this.layoutComponent.type) {
    //   case LayoutComponentType.Signature:
    //     if(this.subtype === 'signature') {
    //       this.openSignature();
    //     }
    //     break;
    // }
  }

  public inputChange() {
    //this._inputChange$.next();
  }

  public openSignature() {
    // const dialogRef = this._dialog.open(SignatureCreateComponent, {
    //   data: {
    //     signeeName: this._signeeName,
    //   },
    // });

    // dialogRef.afterClosed()
    //   .pipe(
    //     filter((svg) => !!svg),
    //     takeUntil(this._destroy$),
    //   )
    //   .subscribe((svg) => {
    //     this._layoutTemplateService
    //       .setLayoutComponentValueValue(this.layoutComponent.id, 'signature', svg);
    //     this.layoutComponentValue = this._layoutTemplateService
    //       .getLayoutComponentValue(this.layoutComponent.id);
    //     this.inputChange();
    //     this._cdRef.markForCheck();
    //   });
  }

  public get hasValue(): boolean {

    return false;
    // if(!this.layoutComponentValue) {
    //   return false;
    // }

    // if(this.isLayoutComponentTypeSignature) {
    //   switch (this.subtype) {
    //     case 'signature': {
    //       return this.configs.signature === LayoutComponentConfig.SignatureView ||
    //       (
    //         !!this.layoutComponentValue.value.signature && (
    //           this.configs.signature === LayoutComponentConfig.SignatureEditPrefill ||
    //         this.configs.signature === LayoutComponentConfig.SignatureEdit
    //         )
    //       );
    //     }
    //     case 'date': {
    //       return this.configs.date === LayoutComponentConfig.DateView ||
    //       (
    //         !!this.layoutComponentValue.value.date && (
    //           this.configs.date === LayoutComponentConfig.DateEditPrefill ||
    //           this.configs.date === LayoutComponentConfig.DateEdit
    //         )
    //       );
    //     }
    //     case 'name': {
    //       return this.configs.name === LayoutComponentConfig.NameView ||
    //       (
    //         !!this.layoutComponentValue.value.name && (
    //           this.configs.name === LayoutComponentConfig.NameEditPrefill ||
    //         this.configs.name === LayoutComponentConfig.NameEdit
    //         )
    //       );
    //     }
    //   }

    //   return false;
    // }

    // if(this.layoutComponent.type === LayoutComponentType.InputFieldText) {
    //   return !!this.layoutComponentValue.value.text;
    // }

    // if(this.layoutComponent.type === LayoutComponentType.InputFieldDate) {
    //   return !!this.layoutComponentValue.value.date;
    // }

    // if(this.layoutComponent.type === LayoutComponentType.Acknowledgements) {
    //   return !!this.layoutComponentValue.value.acknowledgements[this.checkboxIndex];
    // }

    // return false;
  }

  // public get isLayoutComponentTypeSignature(): boolean {
  //   return this.layoutComponent.type === LayoutComponentType.Signature;
  // }

  // public get isLayoutComponentTypeAcknowledgements(): boolean {
  //   return this.layoutComponent.type === LayoutComponentType.Acknowledgements;
  // }

  public get isLayoutComponentSubtypeSignature(): boolean {
    return this.subtype === 'signature';
  }

  public focus(): void {
    this._el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    let el = null;

    el = this.isLayoutComponentSubtypeSignature ?
      this._el.nativeElement.querySelector('.sign-input') :
      this._el.nativeElement.querySelector('input');

    if(el) {
      el.focus();
    }
  }

  public enable(): void {
    this.disabled = false;
    this._cdRef.markForCheck();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
