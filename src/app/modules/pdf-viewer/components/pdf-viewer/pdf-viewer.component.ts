import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

import { NgxExtendedPdfViewerService, PageRenderedEvent } from 'ngx-extended-pdf-viewer';
import { from, Observable } from 'rxjs';


@Component({
  selector: 'fs-pdf-viewer',
  templateUrl: 'pdf-viewer.component.html',
  styleUrls: [ 'pdf-viewer.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsPdfViewerComponent implements OnInit, OnDestroy {

  @Input() public pdf;
  @Input() public height;
  @Input() public pageViewMode: 'infinite-scroll' | 'multiple' | 'single' = 'infinite-scroll';
  @Input() public zoom: 'auto' | 'page-actual' | 'page-fit' | 'page-width' | string  = 'page-width';

  @Output() public init = new EventEmitter();
  @Output() public pageRendered = new EventEmitter<PageRenderedEvent>();

  public src;

  constructor(
    private _ngxService: NgxExtendedPdfViewerService,
    private _element: ElementRef,
    @Inject(DOCUMENT)
    private _document: Document,
  ) {};


  public ngOnInit(): void {
    if(this.pageViewMode === 'infinite-scroll') {
      this.height = '100px';
    }

    setTimeout(() => {
      this.src = this.pdf;
    });
  }

  public getFormData(): Observable<Array<Object>> {
    return from(this._ngxService.getFormData(true));
  }

  public ngOnDestroy() {
  }

}
