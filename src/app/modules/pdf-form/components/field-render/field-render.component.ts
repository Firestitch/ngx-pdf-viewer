import {
  Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ChangeDetectorRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Field } from '../../classes';
import { FieldFormat, FieldType } from '../../enums';
import { FieldService } from '../../services/field-service';


@Component({
  selector: 'fs-field-render',
  templateUrl: './field-render.component.html',
  styleUrls: ['./field-render.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgxExtendedPdfViewerService],
})
export class FieldRenderComponent implements OnInit, OnDestroy {

  @Input() public field: Field;
  @Input() public optionValue;

  public FieldType = FieldType;
  public FieldFormat = FieldFormat;

  private _destroy$ = new Subject();

  constructor(
    private _sanitizer: DomSanitizer,
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

  public get signatureSvg() {
    if(String(this.field.value).match(/^</)) {
      return this._sanitizer.bypassSecurityTrustUrl(`data:image/svg+xml;base64,${btoa(this.field.value)}`);
    }

    return this.field.value;
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
