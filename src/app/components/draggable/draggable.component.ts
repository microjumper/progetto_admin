import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgForOf } from "@angular/common";

import { Draggable } from "@fullcalendar/interaction";

import { LegalService } from "../../../../progetto_shared/legalService.type";

@Component({
  selector: 'app-draggable',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './draggable.component.html',
  styleUrl: './draggable.component.scss'
})
export class DraggableComponent implements AfterViewInit {

  @Input() events: LegalService[] | undefined;
  @ViewChild('container', { static: true }) container: ElementRef | undefined;

  protected readonly JSON = JSON;

  ngAfterViewInit() {
    const externalEvents = new Draggable(this.container?.nativeElement, {
      itemSelector: '.fc-event',
      eventData: (eventEl: HTMLElement) => {
        const stringifiedDataEvent = eventEl.getAttribute('data-event');
        if (stringifiedDataEvent) {
          try {
            return JSON.parse(stringifiedDataEvent);
          } catch (error) {
            console.error("Error parsing data event:", error);
            return null;
          }
        } else {
          console.log("Data events not found.");
          return null;
        }
      }
    });
  }
}
