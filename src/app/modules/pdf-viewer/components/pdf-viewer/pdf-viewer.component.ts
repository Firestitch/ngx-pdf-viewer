import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterContentInit,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerService, PageRenderedEvent } from 'ngx-extended-pdf-viewer';
import { from, Observable } from 'rxjs';


@Component({
  selector: 'fs-pdf-viewer',
  templateUrl: 'pdf-viewer.component.html',
  styleUrls: [ 'pdf-viewer.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsPdfViewerComponent implements OnInit, OnDestroy {

  @ViewChild(NgxExtendedPdfViewerComponent)
  public extendedPdfViewer: NgxExtendedPdfViewerComponent;

  @Input() public pdf;
  @Input() public height;
  @Input() public pageViewMode: 'infinite-scroll' | 'multiple' | 'single' = 'infinite-scroll';
  @Input() public zoom: 'auto' | 'page-actual' | 'page-fit' | 'page-width' | string | number = 'auto';

  @Output() public init = new EventEmitter();
  @Output() public pageRendered = new EventEmitter<PageRenderedEvent>();

  public src;

  constructor(
    private _ngxService: NgxExtendedPdfViewerService,
    private _el: ElementRef,
  ) {};

  public ngOnInit(): void {
    if(this.pageViewMode === 'infinite-scroll') {
      this.height = '100px';
    }

    setTimeout(() => {
      this.src = this.pdf;
    });
  }

  public pdfLoaded(): void {    
    this.extendedPdfViewer.zoomToPageWidth = () => {
      return Promise.resolve();
    }
  }

  public getFormData(): Observable<Array<Object>> {
    return from(this._ngxService.getFormData(true));
  }

  public ngOnDestroy() {
  }

  public resize(): void {
    this._ngxService.recalculateSize();
  }

}
