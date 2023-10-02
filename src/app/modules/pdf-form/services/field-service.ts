import { Injectable, OnDestroy } from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';

import { BehaviorSubject, Subject } from 'rxjs';

import { FieldType } from '../enums';
import { hasValue, initField } from '../helpers';
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

  public constructor(
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

  public get fieldSelected$(): BehaviorSubject<PdfField> {
    return this._fieldSelected$;
  }

  public get fieldChanged$(): Subject<PdfField> {
    return this._fieldChanged$;
  }

  public get fieldBlurred$(): Subject<PdfField> {
    return this._fieldBlurred$;
  }

  public get finished$(): Subject<any> {
    return this._finished$;
  }

  public get fieldSelected() {
    return this._fieldSelected$.getValue();
  }

  public set selectField(field: PdfField) {
    this._fieldSelected$.next(field);
  }

  public set blurField(pdfField: PdfField) {
    this.fieldBlurred$.next(pdfField);
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

  public get completedGroupFields(): GroupField[] {
    return Object.values(this.groupedFields)
      .filter((field) => {
        return field.type === FieldType.Checkbox ? (field.value || []).length : !!field.value;
      });
  }

  public get groupedFields(): GroupField[] {
    return this._groupedFields;
  }

  public groupedField(name): GroupField {
    return this._groupedFields
      .find((groupedField) => groupedField.name === name);
  }

  private _groupFields(fields): void {
    fields
      .forEach((field: PdfField) => {
        const name = field.name || field.guid;
        let groupField = this._groupedFields.find((groupField) => groupField.name === field.name);

        if (!groupField) {
          groupField = {
            name,
            type: field.type,
            value: null,
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

  public get totalRequired(): number {
    return Object.values(this.groupedFields)
      .filter((field) => field.required)
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
    const nextField = this.getNextField(this.fieldSelected);
    if (nextField) {
      this.selectField = nextField;
    } else {
      this.finish();
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

  public getNextField(field: PdfField): PdfField {
    const groupIndex = this.groupedFields
      .findIndex((groupField) => field.name === groupField.name);

    const groupedFields = groupIndex > 0 ?
      this.groupedFields : [
        ...this.groupedFields.slice(groupIndex),
        ...this.groupedFields.slice(0, groupIndex),
      ];

    const nextGroupIndex = groupedFields
      .findIndex((groupField) => {
        return !hasValue(groupField);
      });


    const nextGroupField = this.groupedFields[nextGroupIndex];

    if (!nextGroupField) {
      return null;
    }

    return this.getFields()
      .find((field) => {
        return field.name === nextGroupField.name;
      });
  }

  public getBackField(field: PdfField): PdfField {
    const fields = this.getGroupedRadioButtonFields();
    const index = fields.indexOf(field);
    return index === -1 ? null : fields[index - 1];
  }

  public getFirstField(): PdfField {
    const fields = this.getFields();
    return fields[0];
  }

  public getGroupedRadioButtonFields(): PdfField[] {
    return Object.values(this.getFields()
      .reduce((accum, field: PdfField) => {
        const name = field.type === FieldType.RadioButton ? field.name || field.guid : field.guid;

        if (!accum[name]) {
          accum[name] = field;
        }

        return accum;
      }, {}));
  }

  public scrollToField(field: PdfField): void {
    const el: any = this.containerEl.querySelector(`.field[data-guid="${field.guid}"]`);
    if (el) {
      this.containerEl.scroll({ top: this.getOffsetTop(el) - 50, behavior: 'smooth' });
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
      top += this.getOffsetTop(el.parentNode)
    }

    return top;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}