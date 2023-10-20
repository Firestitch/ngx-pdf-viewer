import { Injectable, OnDestroy } from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FieldType } from '../enums';
import { groupFieldRequired, hasValue, initField, pdfFieldRequired } from '../helpers';
import { GroupField, PdfField } from '../interfaces';


@Injectable()
export class FieldService implements OnDestroy {

  public containerEl;

  private _pdfFieldSet = new Set<PdfField>();
  private _groupedFields: GroupField[] = [];
  private _fieldSelected$ = new BehaviorSubject<PdfField>(null);
  private _fieldChanged$ = new Subject<PdfField>();
  private _fieldBlurred$ = new Subject<PdfField>();
  private _finished$ = new Subject<any>();
  private _destroy$ = new Subject();

  constructor(
    private _prompt: FsPrompt,
  ) { }

  public init(fields: PdfField[]) {
    fields
      .filter((field) => {
        return Object.values<string>(FieldType).includes(field.type);
      })
      .map((field) => {
        return initField(field);
      })
      .forEach((field) => {
        this.addField(field);
      });

    this._groupFields(this.getFields());
  }

  public addField(field: PdfField) {
    this._pdfFieldSet.add(field);
  }

  public removeField(field: PdfField) {
    this._pdfFieldSet.delete(field);
  }

  public get fieldSelected$(): Observable<PdfField> {
    return this._fieldSelected$.asObservable();
  }

  public get fieldChanged$(): Observable<PdfField> {
    return this._fieldChanged$.asObservable();
  }

  public get fieldBlurred$(): Observable<PdfField> {
    return this._fieldBlurred$.asObservable();
  }

  public get finished$(): Observable<any> {
    return this._finished$.asObservable();
  }

  public get fieldSelected(): PdfField {
    return this._fieldSelected$.getValue();
  }

  public set selectField(field: PdfField) {
    this._fieldSelected$.next(field);
  }

  public set blurField(pdfField: PdfField) {
    this._fieldBlurred$.next(pdfField);
  }

  public checkRadioButtonField(name: string, pdfField: PdfField) {
    this.getFields()
      .filter((field: PdfField) => (
        field.type === FieldType.RadioButton &&
        field.name === name
      ))
      .forEach((field: PdfField) => {
        field.value = field.guid === pdfField?.guid;
        this.changeField = field;
      });
  }

  public checkCheckboxField(pdfField: PdfField, value) {
    pdfField.value = value;
    this.changeField = pdfField;
  }

  public set changeField(pdfField: PdfField) {
    this.getFields()
      .filter((field) => !!field.formula)
      .forEach((field) => {
        try {
          let formula = String(field.formula);
          this.getFields().forEach((variableField) => {
            if (variableField.name && !Array.isArray(variableField.value)) {
              formula = formula.replace(variableField.name, variableField.value || 0);
            }
          });

          field.value = eval(formula);
        } catch (e) {
          console.warn(`Formula error: ${e}`);
        }
      });

    const groupField = this.groupedField(pdfField.name);
    if (groupField.type === FieldType.Checkbox) {
      groupField.value = (groupField.value || [])
        .filter((value) => value === pdfField.guid);

      if (pdfField.value) {
        groupField.value.push(pdfField.guid);
      }
    } else if (groupField.type === FieldType.RadioButton) {
      groupField.value = pdfField.guid;

    } else {
      groupField.value = pdfField.value;
    }

    this._fieldChanged$.next(pdfField);
  }

  public get completedRequiredGroupFields(): GroupField[] {
    return Object.values(this.groupedFields)
      .filter((groupedField) => {
        return groupedField.required &&
          !groupedField.readonly &&
          hasValue(groupedField);
      });
  }

  public get groupedFields(): GroupField[] {
    return this._groupedFields;
  }

  public groupedField(name): GroupField {
    return this._groupedFields
      .find((groupedField) => groupedField.name === name);
  }

  public get totalEditable(): number {
    return Object.values(this.groupedFields)
      .filter((field: PdfField) => !field.readonly)
      .length;
  }

  public get totalRequried(): number {
    return Object.values(this.groupedFields)
      .filter((field: PdfField) => field.required && !field.readonly)
      .length;
  }

  public get requiredGroupedFields(): GroupField[] {
    return Object.values(this.groupedFields)
      .filter((field) => field.required);
  }

  public getFields(): PdfField[] {
    return Array.from(this._pdfFieldSet.keys());
  }

  public continue(): void {
    const groupField = this.getGroupField(this.fieldSelected?.name);

    if (groupField && pdfFieldRequired(this.fieldSelected) && !hasValue(groupField)) {
      this.selectField = this.fieldSelected;
    } else {
      const nextField = this.getNextField(this.fieldSelected);
      if (nextField) {
        this.selectField = nextField;
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
    return this.getFields().indexOf(field);
  }

  public getPreviousField(field: PdfField): PdfField {
    return this.getAdjacentField(field, 'backward', false);
  }

  public getNextField(field: PdfField): PdfField {
    return this.getAdjacentField(field, 'forward', true);
  }

  public getGroupField(name: string): GroupField {
    return name ? this.groupedFields
      .find((groupField) => name === groupField.name) : null;
  }

  public getAdjacentField(
    field: PdfField,
    direction: 'forward' | 'backward',
    checkHasValue: boolean,
  ): PdfField {
    const groupIndex = this.groupedFields
      .findIndex((groupField) => field.name === groupField.name);

    const groupedFields = [
      ...this.groupedFields.slice(groupIndex),
      ...this.groupedFields.slice(0, groupIndex),
    ];

    if (direction === 'backward') {
      groupedFields.reverse();
    }

    const adjacentGroupIndex = groupedFields
      .findIndex((groupField, index) => {
        return index && groupFieldRequired(groupField) && (!checkHasValue || !hasValue(groupField));
      });

    const adjacentGroupField = groupedFields[adjacentGroupIndex];

    if (!adjacentGroupField) {
      return null;
    }

    const fields = this.getFields();

    if (direction === 'backward') {
      fields.reverse();
    }

    return fields
      .find((item) => {
        return item.name === adjacentGroupField.name;
      });
  }

  public getFirstField(): PdfField {
    const fields = this.getFields();

    return fields[0];
  }

  public scrollToField(field: PdfField): void {
    const el: any = this.containerEl.querySelector(`.field[data-guid="${field.guid}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  public scrollToSelectedField(): void {
    if (this.fieldSelected) {
      this.scrollToField(this.fieldSelected);
    }
  }

  public getOffsetTop(el): number {
    let top = el.offsetTop;

    if (el && !this.containerEl.isEqualNode(el.parentNode)) {
      top += this.getOffsetTop(el.parentNode);
    }

    return top;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _groupFields(fields): void {
    fields
      .forEach((field: PdfField) => {
        const name = field.name || field.guid;
        let groupField = this._groupedFields
          .find((item) => item.name === field.name);

        if (!groupField) {
          groupField = {
            name,
            type: field.type,
            value: field.value ?? null,
          };
          this._groupedFields.push(groupField);
        }

        if (field.type === FieldType.Checkbox || field.type === FieldType.RadioButton) {
          groupField.values = [
            ...(groupField.values || []),
            field.guid,
          ];
        }

        groupField.required = field.required ?? groupField.required ?? false;
        groupField.readonly = field.readonly ?? groupField.readonly ?? false;
      });
  }

}
