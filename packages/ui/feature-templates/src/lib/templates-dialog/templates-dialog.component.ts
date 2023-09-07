import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { FlowTemplate, FolderId } from '@activepieces/shared';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplatesService } from '@activepieces/ui/common';

export interface TemplateDialogData {
  insideBuilder: boolean;
  folderId$?: Observable<FolderId | undefined>;
  isThereNewFeaturedTemplates$: Observable<boolean>;
}
type tabsNames = 'all ideas' | 'featured';

export interface TemplateDialogClosingResult {
  template: FlowTemplate;
  activeTab: tabsNames;
}

@Component({
  selector: 'app-templates-dialog',
  templateUrl: './templates-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesDialogComponent {
  dialogForm: FormGroup<{
    search: FormControl<string>;
    tags: FormControl<string[]>;
    pieces: FormControl<string[]>;
  }> = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    tags: new FormControl([] as Array<string>, { nonNullable: true }),
    pieces: new FormControl([] as Array<string>, { nonNullable: true }),
  });
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  templates$: Observable<FlowTemplate[]>;
  searchFormControl = new FormControl<string>('');
  featuredListOverflowing = false;
  featuredTemplates$: Observable<FlowTemplate[]>;
  showAllFeaturedTemplates = false;
  filters = [
    'ChatGPT',
    'Content Creation',
    'Social Media',
    'Customer Service',
    'Marketing Automation',
    'Analysis',
  ];
  isThereNewFeaturedTemplates$: Observable<boolean>;
  constructor(
    private templatesService: TemplatesService,
    private dialogRef: MatDialogRef<TemplatesDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: TemplateDialogData
  ) {
    this.templates$ = this.dialogForm.valueChanges.pipe(
      startWith(() => {
        return {
          search: '',
          filters: [],
          apps: [],
        };
      }),
      tap(() => {
        this.loading$.next(true);
      }),
      debounceTime(300),
      switchMap(() => {
        return this.templatesService.getTemplates(
          this.dialogForm.getRawValue()
        );
      }),
      tap(() => {
        this.loading$.next(false);
      }),
      shareReplay(1)
    );

    this.featuredTemplates$ = this.templatesService
      .getTemplates({ featuredOnly: true })
      .pipe(shareReplay(1));
  }
  useTemplate(template: FlowTemplate, tab: tabsNames) {
    const result: TemplateDialogClosingResult = {
      template,
      activeTab: tab,
    };
    this.dialogRef.close(result);
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
