import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FieldService } from '../../services';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';


@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: [ 'header.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() public name;
  @Input() public actions: { label?: string, click?: () => any, color?: string }[] = [];
  
  @Output() public started = new EventEmitter();
  @Output() public closed = new EventEmitter();
  
  public hasStarted;
  public complete = 0;
  public zoom = 100;
  public total = 0;
  public completePercent = 0;
  public mobile;

  private _destroy$ = new Subject();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _fieldService: FieldService,
    private _breakpointObserver: BreakpointObserver,
  ) {}

  public ngOnInit(): void {  
    this._breakpointObserver.observe('(max-width: 699px)')
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((breakpointState: BreakpointState) => {
      this.mobile = breakpointState.matches;
      this._cdRef.markForCheck();
    });    

    this._fieldService.fieldChanged$
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe(() => {
      this.updateProgress();
      this._cdRef.markForCheck();
    });
  }
  
  public continue(): void {
    this._fieldService.continue();
    this._fieldService.scrollToSelectedField();
  }
  
  public updateProgress(): void {
    this.total = this._fieldService.totalRequired;
    this.complete = this._fieldService.totalRequiredCompleted; 
    this.completePercent = Math.round((this.complete/this.total) * 100) || 0;
  }
  
  public start(): void {
    this.hasStarted = true;
    this.updateProgress();
    this.started.emit();
  }
  
  public finish(): void {
    this._fieldService.finish();
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
