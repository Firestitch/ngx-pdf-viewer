import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FieldComponent } from '../components';
import { Field } from '../interfaces';


@Injectable()
export class FieldService implements OnDestroy {

  public fieldComponents = new Map<Field,FieldComponent>();
  

  private _field$ = new BehaviorSubject<Field>(null);
  private _destroy$ = new Subject();

  public init(field: Field, fieldComponent: FieldComponent) {
    this.fieldComponents.set(field, fieldComponent);    
  }

  public get field$() {
    return this._field$;
  }

  public set field(field: Field) {
    this._field$.next(field);
  }

  public getNextField(field: Field): Field {
    return Array.from(this.fieldComponents.keys())
    .find((item) => {
      return item.index > field.index;
    });    
  }

  public getFirstField(): Field {
    const fields = Array.from(this.fieldComponents.keys());
    return fields[0];
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}