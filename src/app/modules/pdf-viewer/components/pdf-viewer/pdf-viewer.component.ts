import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { FsApiFile } from '@firestitch/api';
import { FsFile } from '@firestitch/file';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerService, PageRenderedEvent,
} from 'ngx-extended-pdf-viewer';


@Component({
  selector: 'fs-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsPdfViewerComponent implements OnInit, OnDestroy {

  @ViewChild(NgxExtendedPdfViewerComponent)
  public extendedPdfViewer: NgxExtendedPdfViewerComponent;

  @Input() public pdf: string | ArrayBuffer | Blob | Uint8Array | URL | FsFile | FsApiFile;
  @Input() public height;
  @Input() public backgroundColor = 'rgb(232, 232, 235)';
  @Input() public pageViewMode: 'infinite-scroll' | 'multiple' | 'single' = 'infinite-scroll';
  @Input() public zoom: 'auto' | 'page-actual' | 'page-fit' | 'page-width' | string | number = 'auto';

  @Output() public init = new EventEmitter();
  @Output() public pageRendered = new EventEmitter<PageRenderedEvent>();

  public src: string | ArrayBuffer | Blob | Uint8Array | URL;
  public zoomFactor;

  private _destroy$ = new Subject();

  constructor(
    private _ngxService: NgxExtendedPdfViewerService,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    if (this.pageViewMode === 'infinite-scroll') {
      this.height = '100px';
    }

    this._initSrc();
  }

  public pdfLoaded(): void {
    this.extendedPdfViewer.zoomToPageWidth = () => {
      return Promise.resolve();
    };
  }

  public zoomIn(): void {
    this.zoom = ((this.zoomFactor * 1.25) * 100) + '%';
  }

  public zoomOut(): void {
    this.zoom = ((this.zoomFactor * .75) * 100) + '%';
  }

  public currentZoomFactor(zoomFactor): void {
    this.zoomFactor = zoomFactor;
  }

  public resize(): void {
    this._ngxService.recalculateSize();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initSrc() {
    if (this.pdf instanceof FsApiFile) {
      this.pdf.blob
        .pipe(
          takeUntil(this._destroy$),
        )
        .subscribe((blob) => {
          this.src = blob;
          this._cdRef.markForCheck();
        });
    } else if (this.pdf instanceof FsFile) {
      this.src = this.pdf.file;
    } else {
      this.src = this.pdf;
    }
  }
}
