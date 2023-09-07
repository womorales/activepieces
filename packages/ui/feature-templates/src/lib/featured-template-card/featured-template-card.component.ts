import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  Flow,
  FlowOperationType,
  FlowTemplate,
  FolderId,
  TelemetryEventName,
  TriggerType,
} from '@activepieces/shared';
import { FlowService, TelemetryService } from '@activepieces/ui/common';
import { Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CollectionBuilderService } from '@activepieces/ui/feature-builder-store';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  BLOG_URL_TOKEN,
  TemplateBlogNotificationComponent,
} from '../template-blog-notification/template-blog-notification.component';
@Component({
  selector: 'app-featured-template-card',
  templateUrl: './featured-template-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedTemplateCardComponent implements OnInit {
  useTemplate$: Observable<Flow>;
  showFullDescription = false;
  @Output() useTemplateClicked = new EventEmitter<FlowTemplate>();
  @Input() template: FlowTemplate;
  activepiecesTeam = false;
  loading = false;
  @Input() folderId?: FolderId | null;
  constructor(
    private flowService: FlowService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog,
    private telemetryService: TelemetryService,
    private builderService: CollectionBuilderService
  ) {}
  ngOnInit(): void {
    this.activepiecesTeam =
      this.template.user?.email.endsWith('activepieces.com') || false;
  }
  useTemplate() {
    if (!this.loading) {
      this.loading = true;
      this.useTemplate$ = this.flowService
        .create({
          displayName: this.template.name,
          folderId: this.folderId || undefined,
        })
        .pipe(
          switchMap((flow) => {
            return this.flowService
              .update(flow.id, {
                type: FlowOperationType.IMPORT_FLOW,
                request: this.template.template,
              })
              .pipe(
                tap((updatedFlow: Flow) => {
                  this.loading = false;
                  this.telemetryService.capture({
                    name: TelemetryEventName.FLOW_IMPORTED,
                    payload: {
                      id: this.template.id,
                      name: this.template.name,
                      location: 'Featured tab',
                    },
                  });
                  if (this.template.blogUrl) {
                    this.builderService.componentToShowInsidePortal$.next(
                      new ComponentPortal(
                        TemplateBlogNotificationComponent,
                        null,
                        Injector.create({
                          providers: [
                            {
                              provide: BLOG_URL_TOKEN,
                              useValue: this.template.blogUrl,
                            },
                          ],
                        })
                      )
                    );
                  }
                  this.router.navigate(['flows', updatedFlow.id]);
                })
              );
          })
        );
      this.matDialog.closeAll();
    }
    this.useTemplateClicked.emit(this.template);
  }
  ngAfterViewInit(): void {
    //This is a workaround to make tooltip appear.
    setTimeout(() => {
      this.cd.markForCheck();
    }, 100);
  }
}
