import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer';

import { Subject } from 'rxjs';

import { FieldFormat, FieldType } from '../../enums';
import { PdfField } from '../../interfaces';


@Component({
  selector: 'fs-field-render',
  templateUrl: './field-render.component.html',
  styleUrls: ['./field-render.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgxExtendedPdfViewerService],
})
export class FieldRenderComponent implements OnDestroy {

  @Input() public field: PdfField;
  @Input() public optionValue;

  public FieldType = FieldType;
  public FieldFormat = FieldFormat;

  private _destroy$ = new Subject();

  constructor(
    private _sanitizer: DomSanitizer,
  ) { }

  public get signatureSvg() {
    if (String(this.field.value).match(/^</)) {
      return this._sanitizer.bypassSecurityTrustUrl(`data:image/svg+xml;base64,${btoa(this.field.value)}`);
    }

    return this.field.value;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
