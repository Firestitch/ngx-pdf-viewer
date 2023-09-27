import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FieldFormat, FieldType } from '../../enums';
import { PdfField } from '../../interfaces';
import { FieldService } from '../../services/field-service';


@Component({
  selector: 'fs-field-render',
  templateUrl: './field-render.component.html',
  styleUrls: ['./field-render.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgxExtendedPdfViewerService],
})
export class FieldRenderComponent implements OnInit, OnDestroy {

  @Input() public field: PdfField;
  @Input() public optionValue;

  public FieldType = FieldType;
  public FieldFormat = FieldFormat;

  private _destroy$ = new Subject();

  constructor(
    private _sanitizer: DomSanitizer,
    private _fieldService: FieldService,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this._fieldService.fieldChanged$
      .pipe(
        filter((field: PdfField) => field === this.field),
        takeUntil(this._destroy$),
      )
      .subscribe((field) => {
        this.field = field;
        this._cdRef.markForCheck();
      });
  }

  public get signatureSvg() {
    if (String(this.field.value).match(/^</)) {
      return this._sanitizer.bypassSecurityTrustUrl(`data:image/svg+xml;base64,${btoa(this.field.value)}`);
    }

    return this.field.value;
  }

  public checkboxClick() {
    this.field.value = !this.field.value;
    this._fieldService.changeField = this.field;
  }

  public radiobuttonClick() {
    this.field.value = true;
    this._fieldService.getFields()
      .filter((field: PdfField) => (
        field.type === FieldType.RadioButton &&
        field.name === this.field.name &&
        field !== this.field
      ))
      .forEach((field: PdfField) => {
        field.value = false;
        this._fieldService.changeField = field;
      });

    this._fieldService.changeField = this.field;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
