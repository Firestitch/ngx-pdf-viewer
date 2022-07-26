import { Injectable, OnDestroy } from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';


import { BehaviorSubject, Subject } from 'rxjs';
import { hasValue } from '../helpers';
import { PdfField } from '../interfaces';


@Injectable()
export class FieldService implements OnDestroy {

  public fieldComponents = new Set<PdfField>();
  public containerEl;

  private _field$ = new BehaviorSubject<PdfField>(null);
  private _fieldChanged$ = new Subject<PdfField>();
  private _finished$ = new Subject<any>();
  private _destroy$ = new Subject();

  public constructor(
    private _prompt: FsPrompt,
  ) {}

  public addField(field: PdfField) {
    this.fieldComponents.add(field);    
  }

  public removeField(field: PdfField) {
    this.fieldComponents.delete(field);    
  }

  public get field$(): BehaviorSubject<PdfField> {
    return this._field$;
  }

  public get fieldChanged$(): Subject<PdfField> {
    return this._fieldChanged$;
  }

  public get finished$(): Subject<any> {
    return this._finished$;
  }

  public get field() {
    return this._field$.getValue();
  }

  public set selectField(field: PdfField) {
    this._field$.next(field); 
  }

  public set changeField(changeField: PdfField) {
    this.getFields()
    .filter((field) => !!field.formula)
    .forEach((field) => {
      try {
        let formula = String(field.formula);
        this.getFields().forEach((variableField) => {
          if(variableField.name && !Array.isArray(variableField.value)) {
            formula = formula.replace(variableField.name, variableField.value || 0);
          }
        });   
                
        field.value = eval(formula);    
      } catch(e) {
        console.warn(`Formula error: ${e}`);
      }
    });

    this._fieldChanged$.next(changeField);
  }

  public get totalRequiredCompleted(): number {
    return this.getFields()
    .filter((field) => field.required && field.value)
    .length;
  }

  public get totalRequired(): number {
    return this.getFields()
    .filter((field) => field.required)
    .length;
  }

  public getFields(): PdfField[] {
    return Array.from(this.fieldComponents.keys());
  }

  public continue(): void {
    const nextField = this.getNextField(this.field);
    if(nextField) {
      this.selectField = nextField;
    } else {
      const field = this.getFields()
      .find((field) => !!field.required && !hasValue(field));

      if(field) {
        this.selectField = field;
      } else {
        this.finish();
      }      
    }
  }

  public finish(): void {
    this._prompt.confirm({
      title: 'Confirm Submit',
      template: 'You are about to submit your form. Are you sure you want to submit?',
      buttons: [
        {
          label: 'Submit',
          color: 'primary',
          value: true,
        },
        {
          label: 'Cancel',
          cancel: true,
        },
      ],
    }).subscribe(() => {
      this._finished$.next();
    });
  }

  public getFieldIndex(field: PdfField): number {
    const fields = this.getFields();
    return fields.indexOf(field);
  }

  public getNextField(field: PdfField): PdfField {
    const index = this.getFieldIndex(field);
    return index === -1 ? null : this.getFields()[index + 1];
  }

  public getBackField(field: PdfField): PdfField {
    const index = this.getFieldIndex(field);
    return index === -1 ? null : this.getFields()[index - 1];
  }

  public getFirstField(): PdfField {
    const fields = this.getFields();
    return fields[0];
  }
  
  public scrollToField(field: PdfField): void {
    const el: any = this.containerEl.querySelector(`.field[data-guid="${field.guid}"]`);
    if(el) {
      this.containerEl.scroll({top: this.getOffsetTop(el) - 50, behavior: 'smooth'});
    }
  }

  public scrollToSelectedField(): void {
    if(this.field) {
      this.scrollToField(this.field);
    }
  }

  public getOffsetTop(el): number {
    let top = el.offsetTop;
    
    if(el && !this.containerEl.isEqualNode(el.parentNode)) {
      top += this.getOffsetTop(el.parentNode)
    }

    return top;
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}