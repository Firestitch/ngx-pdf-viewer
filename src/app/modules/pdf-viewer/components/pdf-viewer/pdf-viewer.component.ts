import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { FsApiFile } from '@firestitch/api';
import { FsFile } from '@firestitch/file';

import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { PdfViewerComponent, RenderTextMode } from 'ng2-pdf-viewer';


@Component({
  selector: 'fs-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsPdfViewerComponent implements OnInit, OnDestroy {

  @ViewChild(PdfViewerComponent)
  public pdfViewer: PdfViewerComponent;

  @Input() public pdf: string | ArrayBuffer | Blob | Uint8Array | URL | FsFile | FsApiFile;
  @Input() public height;
  @Input() public renderText = true;
  @Input() public renderTextMode: RenderTextMode = RenderTextMode.ENABLED;
  
  @Input() 
  @HostBinding('style.background-color')
  public backgroundColor = 'rgb(232, 232, 235)';

  @Output() public init = new EventEmitter();

  public src: string | Uint8Array;
  public zoomFactor = 1;
  public rendered = false;

  private _destroy$ = new Subject();

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this._initSrc();
  }

  public loaded(): void {
    this.rendered = true;
    this.pdfViewer.updateSize();
  }

  public zoomIn(): void {
    this.zoomFactor += .25;
  }

  public zoomOut(): void {
    this.zoomFactor -= .25;
  }

  public currentZoomFactor(zoomFactor): void {
    this.zoomFactor = zoomFactor;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initSrc() {
    if (this.pdf instanceof FsApiFile || this.pdf instanceof FsFile || this.pdf instanceof Blob) {
      of(null)
        .pipe(
          switchMap(() => {             
            if(this.pdf instanceof FsApiFile) {
              return this.pdf.blob; 
            } else if(this.pdf instanceof FsFile) {
              return of(this.pdf.file); 
            }

            return of(this.pdf);
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
    } else if (this.pdf instanceof ArrayBuffer) {
      this.src = new Uint8Array(this.pdf);
    } else if(this.pdf && typeof this.pdf === 'string') {
      this.src = this.pdf.toString();
    }
  }
}

