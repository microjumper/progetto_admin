import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { RippleModule } from "primeng/ripple";
import { CheckboxModule } from "primeng/checkbox";

import { Draggable } from "@fullcalendar/interaction";

import { LegalService } from "../../../../progetto_shared/legalService.type";
import { DataService } from "../../services/data/data.service";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: 'app-draggable',
  standalone: true,
  imports: [
    NgForOf,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputMaskModule,
    InputTextModule,
    NgIf,
    ReactiveFormsModule,
    RippleModule,
    CheckboxModule,
    FormsModule
  ],
  templateUrl: './draggable.component.html',
  styleUrl: './draggable.component.scss'
})
export class DraggableComponent implements AfterViewInit {

  @Input() legalServices: LegalService[] = [];
  @ViewChild('container', { static: true }) container: ElementRef | undefined;

  checkedLegalServices: string[] = [];
  formDialogVisible: boolean = false;
  legalServiceForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.legalServiceForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      duration: ['', [Validators.required, this.validateDuration]]
    });
  }

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

  createStringifiedEventData(legalService : LegalService): string {
    const eventData = {
      title: legalService.title,
      duration: legalService.duration,
      extendedProps: {
        legalService: legalService.id
      }
    }
    return JSON.stringify(eventData);
  }

  onSubmit(): void {
    if (this.legalServiceForm.valid) {
      const legalService: LegalService = {
        id: "0",
        title: this.legalServiceForm.value.title,
        duration: this.legalServiceForm.value.duration
      };

      this.dataService.addLegalService(legalService).subscribe(
        (response: LegalService) => {
          this.legalServices.push(response)
        }
      );

      this.hideDialog();
    }
  }

  removeCheckedServices(): void {
    this.confirmationService.confirm({
      message: 'Procedere con l\'eliminazione?',
      header: 'Conferma Eliminazione',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        this.dataService.deleteLegalServices(this.checkedLegalServices).subscribe({
            next: (response: LegalService[]) => {
              this.legalServices = this.legalServices.filter(service => !this.checkedLegalServices.includes(service.id));
              this.checkedLegalServices = [];
            },
            error: (error) => {
              console.error(error);
            },
            complete: () => this.messageService.add({ severity: 'success', summary: 'Eliminazione completata', detail: 'Eliminazione avvenuta con successo',  life: 1500 })
          }
        );
      },
      reject: () => {}
    });
  }

  showDialog(): void {
    this.formDialogVisible = true;
  }

  private hideDialog(): void {
    this.formDialogVisible = false;
  }

  private validateDuration(control: FormControl) {
    const value = control.value;
    if (!value) {
      return { invalidDuration: true };
    }

    const [hours, minutes] = value.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return { invalidNumber: true };
    }

    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes < 30) {
      return { invalidDuration: true };
    }

    return null;
  }
}
