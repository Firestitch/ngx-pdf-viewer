import {
  Component, ChangeDetectionStrategy,
  OnInit, ElementRef, OnDestroy, ChangeDetectorRef, 
  Input, ViewChild, OnChanges, SimpleChanges, Output, 
  EventEmitter,
} from '@angular/core';

import { MatInput } from '@angular/material/input';

import { merge, of, Subject } from 'rxjs';
import { FieldFormat, FieldType } from '../../enums';

import { FieldService } from '../../services';
import { map, takeUntil } from 'rxjs/operators';
import { PdfField } from '../../interfaces';
import { FsFormDirective } from '@firestitch/form';


@Component({
  selector: 'fs-field-input',
  templateUrl: './field-input.component.html',
  styleUrls: ['./field-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldInputComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('input', { read: MatInput })
  public input: MatInput;
  
  @ViewChild(FsFormDirective)
  public form: FsFormDirective;

  @Input() public field: PdfField;

  @Output() public closed = new EventEmitter<any>();

  public FieldType = FieldType;
  public FieldFormat = FieldFormat;
  public nextField: PdfField;
  public backField: PdfField;
  public radioButtonField = null;
  public radioButtonFields = [];
  public description;
  public label;

  private _destroy$ = new Subject();

  constructor(
    private _el: ElementRef,
    private _fieldService: FieldService,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    merge(
      this._fieldService.field$
      .pipe(
        map((field) => ({ field, focus: true }))
      ),
      this._fieldService.fieldChanged$
      .pipe(
        map((fieldChange) => ({field: fieldChange.field, focus: false }))
      )
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

    if(this.field.type === FieldType.RadioButton || this.field.type === FieldType.Checkbox) {
      this._fieldService.getFields()
      .filter((field: PdfField) => (
        field.type === this.field.type &&
        field.name === this.field.name
      ))
      .forEach((field) => {
        this.label = field.groupLabel || this.label;
        this.description = field.groupDescription || this.description;
      });
        
      if(this.field.type === FieldType.RadioButton) {
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

    if(focus) {
      setTimeout(() => {
        this.focus();
      }, 50);     
    }
  }
  
  public inputKeyDown(event: KeyboardEvent): void {
    if(event.code === 'Tab') {
      if(event.shiftKey) {
        this.back();
      } else {
        this.form.triggerSubmit();
      }
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes.field) {

    }
  }

  public radioButtonFieldChange(selectedField: PdfField): void {
    if(selectedField) {
      this._fieldService.getFields()
      .filter((field: PdfField) => (
        field.type === FieldType.RadioButton &&
        field.name === this.field.name 
      ))
      .forEach((field: PdfField) => {
        field.value = field === selectedField;
      });

      this._fieldService.changeField = { field: selectedField, event: 'change' };
    } else {
      this._fieldService.getFields()
      .filter((field: PdfField) => (
        field.type === FieldType.RadioButton && field.value
      ))
      .forEach((field: PdfField) => {
        field.value = false;        
        this._fieldService.changeField = { field, event: 'change' };
      });
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public change(): void {
    this._fieldService.changeField = { field: this.field, event: 'change' };
  }

  public blur(): void {
    this._fieldService.changeField = { field: this.field, event: 'blur' };
  }

  public focus(): void {
    if(this.input) {
      this.input.focus();
    }
  }

  public close(): void {
    this.closed.emit();
  }

  public back() {
    if(this.backField) {
      this._fieldService.selectField = this.backField;
    }
  }
  
  public submit = () => {
    this._fieldService.continue();
    this._fieldService.scrollToSelectedField();

    return of(true);
  }
}
