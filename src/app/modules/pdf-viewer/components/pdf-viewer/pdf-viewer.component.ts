import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { FsApiFile } from '@firestitch/api';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerService, PageRenderedEvent } from 'ngx-extended-pdf-viewer';
import { Observable, Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PdfField } from '../../../pdf-form/interfaces';


@Component({
  selector: 'fs-pdf-viewer',
  templateUrl: 'pdf-viewer.component.html',
  styleUrls: ['pdf-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsPdfViewerComponent implements OnInit, OnDestroy {

  @ViewChild(NgxExtendedPdfViewerComponent)
  public extendedPdfViewer: NgxExtendedPdfViewerComponent;

  @Input() public pdf: string | FsApiFile;
  @Input() public fields: PdfField[] = [];
  @Input() public height;
  @Input() public pageViewMode: 'infinite-scroll' | 'multiple' | 'single' = 'infinite-scroll';
  @Input() public zoom: 'auto' | 'page-actual' | 'page-fit' | 'page-width' | string | number = 'auto';

  @Output() public init = new EventEmitter();
  @Output() public pageRendered = new EventEmitter<PageRenderedEvent>();

  public src;

  private _destroy$ = new Subject();

  constructor(
    private _ngxService: NgxExtendedPdfViewerService,
    private _cdRef: ChangeDetectorRef,
  ) { };

  public ngOnInit(): void {
    if (this.pageViewMode === 'infinite-scroll') {
      this.height = '100px';
    }

    this._initSrc();
  }

  public pdfLoaded(): void {
    this.extendedPdfViewer.zoomToPageWidth = () => {
      return Promise.resolve();
    }
  }

  public getFormData(): Observable<Array<Object>> {
    return from(this._ngxService.getFormData(true));
  }

  public pageRenderedd(event) {
  }

  public resize(): void {
    this._ngxService.recalculateSize();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initSrc() {
    if (typeof this.pdf === 'string') {
      this.src = this.pdf;
    }

    if (this.pdf instanceof FsApiFile) {
      this.pdf.blob
        .pipe(
          takeUntil(this._destroy$),
        )
        .subscribe((blob) => {
          this.src = blob;
          this._cdRef.markForCheck();
        });
    }
  }
}
