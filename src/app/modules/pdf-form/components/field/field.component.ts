import {
  Component, ChangeDetectionStrategy,
  OnInit, OnDestroy, Inject, ChangeDetectorRef, HostListener, HostBinding, ElementRef,
} from '@angular/core';

import { Subject } from 'rxjs';

import {
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer';
import { Field } from '../../interfaces';
import { FieldFormat, FieldType } from '../../enums';
import { FieldService } from '../../services';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgxExtendedPdfViewerService],
})
export class FieldComponent implements OnInit, OnDestroy {

  @HostListener('click')
  public click(): void {
    this.select();
  }

  public selected = false;
  public FieldType = FieldType;
  public FieldFormat = FieldFormat;

  private _destroy$ = new Subject();

  constructor(
    @Inject('field') private _field: Field,
    @Inject('fieldService') private _fieldService: FieldService,
    @Inject('optionValue') public optionValue: { value: any, label: any },
    private _cdRef: ChangeDetectorRef,
    protected _sanitizer: DomSanitizer,
  ) {}

  public ngOnInit(): void {
    this._fieldService.field$
    .pipe(
      tap(() => {
        this.selected = false;
        this._cdRef.markForCheck();
      }),
      filter((field: Field) => field === this._field),
      takeUntil(this._destroy$),
    )
    .subscribe(() => {
      this.selected = true;
      this._cdRef.markForCheck();  
    });

    this._fieldService.fieldChange$
    .pipe(
      filter((field: Field) => field === this._field),
      takeUntil(this._destroy$),
    )
    .subscribe(() => {
      this._cdRef.markForCheck();  
    });    
  }
  
  public select(): void {
    this._fieldService.selectField = this._field;
  }

  public get field() {
    return this._field;
  }

  public set field(field: Field) {
    this._field = field;
  }

  public markForCheck(): void {
    this._cdRef.markForCheck();
  }

  public fieldClick(): void {
    if(this.field.type === FieldType.Checkbox) {
      const index = this.field.value.indexOf(this.optionValue.value);
      if(index === -1) {
        this.field.value.push(this.optionValue.value);
      } else {
        this.field.value.splice(index, 1);
      }
    } else if(this.field.type === FieldType.RadioButton) {
      this.field.value = this.optionValue.value;
    }
  }

  public get signatureSvg() {
    if(String(this.field.value).match(/^</)) {
      return this._sanitizer.bypassSecurityTrustUrl(`data:image/svg+xml;base64,${btoa(this.field.value)}`);
    }

    return this.field.value;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
