import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FieldComponent } from '../components';
import { Field } from '../interfaces';


@Injectable()
export class FieldService implements OnDestroy {

  public fieldComponents = new Map<Field,FieldComponent>();
  public containerEl;

  private _field$ = new BehaviorSubject<Field>(null);
  private _fieldChange$ = new Subject<Field>();
  private _destroy$ = new Subject();

  public init(field: Field, fieldComponent: FieldComponent) {
    this.fieldComponents.set(field, fieldComponent);    
  }

  public get field$() {
    return this._field$;
  }

  public get fieldChange$() {
    return this._fieldChange$;
  }

  public set selectField(field: Field) {
    this._field$.next(field);
  }

  public set changeField(changeField: Field) {
    this.getFields()
    .filter((field) => !!field.formula)
    .forEach((field) => {
      let formula = field.formula;
      this.getFields().forEach((variableField) => {
        if(!Array.isArray(variableField.value)) {
          formula = formula.replace(variableField.name, variableField.value || 0);
        }
      });      

      try {
        field.value = eval(formula);    
      } catch(e) {
        console.warn(`Formula error: ${e}`);
      }
    });

    this._fieldChange$.next(changeField);
  }

  public get complete(): number {
    return this.getFields()
    .filter((field) => field.value !== null)
    .length;
  }

  public get total(): number {
    return this.getFields().length;
  }

  public getFields(): Field[] {
    return Array.from(this.fieldComponents.keys());
  }

  public getFieldIndex(field: Field): number {
    const fields = this.getFields();
    return fields.indexOf(field);
  }

  public getNextField(field: Field): Field {
    const index = this.getFieldIndex(field);
    return index === -1 ? null : this.getFields()[index + 1];
  }

  public getBackField(field: Field): Field {
    const index = this.getFieldIndex(field);
    return index === -1 ? null : this.getFields()[index - 1];
  }

  public getFirstField(): Field {
    const fields = Array.from(this.fieldComponents.keys());
    return fields[0];
  }
  
  public scrollToField(field: Field): void {
    const el: any = this.containerEl.querySelector(`section[data-annotation-id="${field.id}"]`);
    if(el) {
      this.containerEl.scroll({top: this.getOffsetTop(el), behavior: 'smooth'});
    }
  }

  public getOffsetTop(el): number {
    let top = el.offsetTop;
    
    if(el && !this.containerEl.isEqualNode(this.containerEl, el)) {
      top += this.getOffsetTop(el.parent)
    }

    return top;
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}