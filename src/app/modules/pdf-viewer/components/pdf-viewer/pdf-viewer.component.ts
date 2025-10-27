import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

import { FsApiFile } from '@firestitch/api';
import { FsFile } from '@firestitch/file';

import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { PdfViewerComponent, RenderTextMode, PdfViewerModule } from 'ng2-pdf-viewer';
import { MatMiniFabAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';


@Component({
    selector: 'fs-pdf-viewer',
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatMiniFabAnchor,
        MatIcon,
        PdfViewerModule,
        NgClass,
    ],
})
export class FsPdfViewerComponent implements OnDestroy {

  @ViewChild(PdfViewerComponent)
  public pdfViewer: PdfViewerComponent;

  @Input()
  public set pdf(pdf: string | ArrayBuffer | Blob | Uint8Array | URL | FsFile | FsApiFile) {
    this.rendered = false;
    if (pdf instanceof FsApiFile || pdf instanceof FsFile || pdf instanceof Blob) {
      of(null)
        .pipe(
          switchMap(() => {
            if (pdf instanceof FsApiFile) {
              return pdf.blob;
            } else if (pdf instanceof FsFile) {
              return of(pdf.file);
            }

            return of(pdf);
          }),
          switchMap((blob: any) => {
            return new Observable((observer) => {
              const fileReader = new FileReader();
              fileReader.onload = () => {
                observer.next(new Uint8Array(fileReader.result as ArrayBuffer));
                observer.complete();
              };
              fileReader.onerror = (e) => {
                observer.error(e);
              };

              fileReader.readAsArrayBuffer(blob);
            });
          }),
          takeUntil(this._destroy$),
        )
        .subscribe((data: any) => {
          this.src = data;
          this._cdRef.markForCheck();
        });
    } else if (pdf instanceof ArrayBuffer) {
      this.src = new Uint8Array(pdf);
    } else if (typeof pdf === 'string') {
      this.src = pdf.toString();
    } else {
      this.src = null;
    }
  }
  @Input() public height;
  @Input() public renderText = true;
  @Input() public zoomEnabled = true;
  @Input() public zoom = 1;
  @Input() public renderTextMode: RenderTextMode = RenderTextMode.ENABLED;

  @Input()
  @HostBinding('style.background-color')
  public backgroundColor = 'rgb(232, 232, 235)';

  @Output() public pageRenderer = new EventEmitter();
  @Output() public init = new EventEmitter();

  public src: string | Uint8Array;
  public rendered = false;

  private _destroy$ = new Subject();
  private _cdRef = inject(ChangeDetectorRef);

  public pageRendered(): void {
    this.rendered = true;
    this.pageRenderer.emit();
    this.pdfViewer.updateSize();
  }

  public loadCompleted(): void {
    this.init.emit();
  }

  public zoomIn(): void {
    this.zoom += .25;

  }

  public zoomOut(): void {
    this.zoom = Math.max(this.zoom - .25, 0.1);
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}

