import {
  Component, ChangeDetectionStrategy,
  OnInit, ElementRef, OnDestroy, ChangeDetectorRef, 
  Input, ViewChild, OnChanges, SimpleChanges, Output, 
  EventEmitter,
} from '@angular/core';

import { MatInput } from '@angular/material/input';

import { of, Subject } from 'rxjs';
import { FieldFormat, FieldType } from '../../enums';

import { FieldService } from '../../services';
import { takeUntil } from 'rxjs/operators';
import { PdfField } from '../../interfaces';


@Component({
  selector: 'fs-field-input',
  templateUrl: './field-input.component.html',
  styleUrls: ['./field-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldInputComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('input', { read: MatInput })
  public input: MatInput;

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
    this._fieldService.fieldChanged$
    .pipe(
      takeUntil(this._destroy$),      
    )
    .subscribe(() => {
      this._cdRef.markForCheck();  
    });    
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes.field) {
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
          this.radioButtonField = this.field;
          this.radioButtonFields = this._fieldService.getFields()
          .filter((field: PdfField) => (
            field.type === FieldType.RadioButton &&
            field.name === this.field.name
          ));
        } 
       } else {
        this.description = this.field.description;
        this.description = this.field.label;
       }

      setTimeout(() => {
        this.focus();
      }, 50);
    }
  }

  public radioButtonFieldChange(selectedField): void {
    this._fieldService.getFields()
    .filter((field: PdfField) => (
      field.type === FieldType.RadioButton &&
      field.name === this.field.name 
    ))
    .forEach((field: PdfField) => {
      field.value = field === selectedField;
    });

    this._fieldService.changeField = selectedField;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public change(): void {
    this._fieldService.changeField = this.field;
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
