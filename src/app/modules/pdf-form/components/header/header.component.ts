import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FieldService } from '../../services';


@Component({
  selector: 'fs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() public name;
  @Input() public actions: { label?: string; click?: () => any; color?: string }[] = [];
  @Input() public closed: EventEmitter<any>;
  @Input() public started: EventEmitter<any>;

  public hasStarted;
  public completed = 0;
  public zoom = 100;
  public total = 0;
  public completedPercent = 0;
  public mobile;

  private _destroy$ = new Subject();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _fieldService: FieldService,
    private _breakpointObserver: BreakpointObserver,
  ) { }

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
    this.total = this._fieldService.totalRequried;
    this.completed = this._fieldService.completedRequiredGroupFields.length;
    this.completedPercent = Math.round((this.completed / this.total) * 100) || 0;
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
