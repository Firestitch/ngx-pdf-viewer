import {
  Component, ChangeDetectionStrategy,
  OnInit, OnDestroy, Inject, ChangeDetectorRef, HostListener,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

import {
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer';

import { FieldFormat, FieldType } from '../../enums';
import { FieldService } from '../../services/field-service';
import { PdfField } from '../../interfaces';
import { hasValue } from '../../helpers';


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

  public fontScaleThreshold = 9;

  private _destroy$ = new Subject();

  constructor(
    @Inject('field') private _field: PdfField,
    @Inject('fieldService') private _fieldService: FieldService,
    @Inject('optionValue') public optionValue: { value: any, label: any },
    @Inject('scale') public scale: number,
    private _cdRef: ChangeDetectorRef,
    protected _sanitizer: DomSanitizer,
  ) {}

  public ngOnInit(): void {
    this._fieldService.addField(this._field);
    this._fieldService.field$
    .pipe(
      tap(() => {
        this.selected = false;
        this._cdRef.markForCheck();
      }),
      filter((field: PdfField) => field === this._field),
      takeUntil(this._destroy$),
    )
    .subscribe(() => {
      this.selected = true;
      this._cdRef.markForCheck();
    });

    this._fieldService.fieldChanged$
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe(() => {
      this._cdRef.markForCheck();
    });
  }

  public get hasValue(): boolean {
    return hasValue(this.field)
  }

  public select(): void {
    this._fieldService.selectField = this._field;
  }

  public get field(): PdfField {
    return this._field;
  }

  public set field(field: PdfField) {
    this._field = field;
  }

  public markForCheck(): void {
    this._cdRef.markForCheck();
  }

  public fieldClick(): void {
    if(this.field.type === FieldType.Checkbox) {
      this.field.value = !this.field.value;

    } else if(this.field.type === FieldType.RadioButton) {
      this.field.value = true;
      this._fieldService.getFields()
      .filter((field: PdfField) => (
        field.type === FieldType.RadioButton &&
        field.name === this.field.name &&
        field !== this.field
      ))
      .forEach((field: PdfField) => {
        field.value = false
      });
    }

    this._fieldService.changeField = { field: this.field, event: 'change' };
  }

  public ngOnDestroy(): void {
    this._fieldService.removeField(this._field);
    this._destroy$.next();
    this._destroy$.complete();
  }
}
