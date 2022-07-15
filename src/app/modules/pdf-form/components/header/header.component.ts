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

import { skip, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FieldService } from '../../services';
import { FsPrompt } from '@firestitch/prompt';
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
  
  @Output() public start = new EventEmitter();
  @Output() public finish = new EventEmitter();
  @Output() public close = new EventEmitter();
  
  public started;
  public complete = 0;
  public zoom = 100;
  public total = 0;
  public completePercent = 0;
  public mobile;

  private _destroy$ = new Subject();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _fieldService: FieldService,
    private _prompt: FsPrompt,
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

    this._fieldService.fieldChange$
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe(() => {
      this.updateProgress();
      this._cdRef.markForCheck();
    });
  }
  
  public updateProgress(): void {
    this.total = this._fieldService.totalRequired;
    this.complete = this._fieldService.totalRequiredCompleted; 
    this.completePercent = Math.round((this.complete/this.total) * 100) || 0;
  }
  
  public startClick(): void {
    this.started = true;
    this.updateProgress();
    this.start.emit();
  }
  
  public finishClick(): void {
    this._prompt.confirm({
      title: 'Confirm Submit',
      template: 'You are about to submit your form. Are you sure you want to submit?',
      buttons: [
        {
          label: 'Submit',
          color: 'primary',
          value: true,
        },
        {
          label: 'Cancel',
          cancel: true,
        },
      ],
    }).subscribe(() => {
      this.finish.emit();
      this._cdRef.markForCheck();
    });
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
