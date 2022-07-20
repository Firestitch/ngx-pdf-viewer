import {
  Component, ChangeDetectionStrategy,
  OnInit, ElementRef, OnDestroy, ChangeDetectorRef, 
  Input, ViewChild, OnChanges, SimpleChanges, Output, 
  EventEmitter,
} from '@angular/core';

import { MatInput } from '@angular/material/input';

import { of, Subject } from 'rxjs';
import { FieldType } from '../../enums';

import { Field } from '../../classes';
import { FieldService } from '../../services';


@Component({
  selector: 'fs-field-input',
  templateUrl: './field-input.component.html',
  styleUrls: ['./field-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldInputComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('input', { read: MatInput })
  public input: MatInput;

  @Input() public field: Field;

  @Output() public closed = new EventEmitter<any>();

  public FieldType = FieldType;
  public nextField: Field;
  public backField: Field;

  private _destroy$ = new Subject();

  constructor(
    private _el: ElementRef,
    private _fieldService: FieldService,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes.field) {
      this.backField = this._fieldService.getBackField(this.field);
      this.nextField = this._fieldService.getNextField(this.field);
      setTimeout(() => {
        this.focus();
      }, 50);
    }
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
