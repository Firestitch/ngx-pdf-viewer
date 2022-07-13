import {
  Component, ChangeDetectionStrategy,
  OnInit, OnDestroy, Inject, ChangeDetectorRef, HostListener, HostBinding,
} from '@angular/core';

import { Subject } from 'rxjs';

import {
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer';
import { Field } from '../../interfaces';
import { FieldType } from '../../enums';
import { FieldService } from '../../services';
import { filter, takeUntil, tap } from 'rxjs/operators';


@Component({
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgxExtendedPdfViewerService],
})
export class FieldComponent implements OnInit, OnDestroy {

  @HostListener('click')
  public click() {
    this.select();
  }

  public selected = false;
  public FieldType = FieldType;

  private _destroy$ = new Subject();

  constructor(
    @Inject('field') private _field: Field,
    @Inject('fieldService') private _fieldService: FieldService,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._fieldService.field$
    .pipe(
      tap(() => {
        this.selected = false;
        this._cdRef.markForCheck();
      }),
      filter((field: Field) => field === this._field),
      takeUntil(this._destroy$),
    )
    .subscribe(() => {
      this.selected = true;
      this._cdRef.markForCheck();
    });
  }
  
  public select(): void {
    this._fieldService.field = this._field;
  }

  public get field() {
    return this._field;
  }

  public set field(field: Field) {
    this._field = field;
  }

  public markForCheck(): void {
    this._cdRef.markForCheck();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
