import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { MatInput } from '@angular/material/input';

import { merge, Observable, of, Subject } from 'rxjs';
import { FieldFormat, FieldType } from '../../enums';

import { FsFormDirective } from '@firestitch/form';
import { map, takeUntil } from 'rxjs/operators';
import { PdfField } from '../../interfaces';
import { FieldService } from '../../services';


@Component({
  selector: 'fs-field-input',
  templateUrl: './field-input.component.html',
  styleUrls: ['./field-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldInputComponent implements OnInit, OnDestroy {

  @ViewChild('input', { read: MatInput })
  public input: MatInput;

  @ViewChild(FsFormDirective)
  public form: FsFormDirective;

  @Input() public field: PdfField;
  @Input() public defaultVaidation: (field: PdfField) => Observable<any>;

  @Output() public closed = new EventEmitter<any>();

  public FieldType = FieldType;
  public FieldFormat = FieldFormat;
  public nextField: PdfField;
  public backField: PdfField;
  public radioButtonField: PdfField = null;
  public radioButtonFields: PdfField[] = [];
  public description;
  public label;

  private _destroy$ = new Subject();
  private _inputChange$ = new Subject();

  constructor(
    private _fieldService: FieldService,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public changeInput(): void {
    this._inputChange$.next(this.field.value);
  }

  public ngOnInit(): void {
    this._inputChange$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.change();
      });

    merge(
      this._fieldService.fieldSelected$
        .pipe(
          map((field) => ({ field, focus: true }))
        ),
    )
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((data) => {
        this.field = data.field;
        this.updateField(data.focus);
        this._cdRef.markForCheck();
      });
  }

  public updateField(focus: boolean) {
    this.backField = this._fieldService.getBackField(this.field);
    this.nextField = this._fieldService.getNextField(this.field);
    this.description = '';
    this.label = '';

    if (this.field.type === FieldType.RadioButton || this.field.type === FieldType.Checkbox) {
      this._fieldService.getFields()
        .filter((field: PdfField) => (
          field.type === this.field.type &&
          field.name === this.field.name
        ))
        .forEach((field) => {
          this.label = field.groupLabel || this.label;
          this.description = field.groupDescription || this.description;
        });

      if (this.field.type === FieldType.RadioButton) {
        this.radioButtonFields = this._fieldService.getFields()
          .filter((field: PdfField) => (
            field.type === FieldType.RadioButton &&
            field.name === this.field.name
          ));

        this.radioButtonField = this.radioButtonFields
          .find((field) => (field.value));
      }
    } else {
      this.description = this.field.description;
      this.label = this.field.label;
    }

    if (focus) {
      setTimeout(() => {
        this.focus();
      }, 50);
    }
  }

  public inputKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Tab') {
      if (event.shiftKey) {
        this.back();
      } else {
        this.form.triggerSubmit();
      }
    }
  }

  public checkRadioButtonField(name: string, field: PdfField): void {
    this._fieldService.checkRadioButtonField(name, field);
  }

  public checkCheckboxField(field: PdfField, value): void {
    this._fieldService.checkCheckboxField(field, value);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public change(): void {
    this._fieldService.changeField = this.field;
  }

  public blur(): void {
    this._fieldService.blurField = this.field;
  }

  public focus(): void {
    if (this.input) {
      this.input.focus();
    }
  }

  public close(): void {
    this.closed.emit();
  }

  public back() {
    if (this.backField) {
      this._fieldService.selectField = this.backField;
    }
  }

  public submit = () => {
    this._fieldService.continue();
    this._fieldService.scrollToSelectedField();

    return of(true);
  }
}
