import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from "@angular/common";

import { SidebarModule } from "primeng/sidebar";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { InputTextModule } from "primeng/inputtext";
import { DialogModule } from "primeng/dialog";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputMaskModule } from "primeng/inputmask";

import { CalendarComponent } from "../calendar/calendar.component";
import { EventService } from "../../services/event/event.service";
import { LegalService } from "../../../../progetto_shared/legalService.type";
import { DraggableComponent } from "../draggable/draggable.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarModule,
    CalendarComponent,
    DraggableComponent,
    ButtonModule,
    RippleModule,
    ReactiveFormsModule,
    InputTextModule,
    DialogModule,
    FloatLabelModule,
    InputMaskModule,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  legalServices: LegalService[] = [];
  formDialogVisible: boolean = false;
  legalServiceForm: FormGroup;

  constructor(private eventService: EventService, private formBuilder: FormBuilder) {
    this.legalServiceForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(3)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      duration: ['', [Validators.required, this.validateDuration]]
    });
  }

  ngOnInit(): void {
    this.eventService.getLegalServices().subscribe({
      next: (legalServices) => {
        this.legalServices = legalServices;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.legalServiceForm.valid) {
      const legalService: LegalService = {
        id: this.legalServiceForm.value.id,
        title: this.legalServiceForm.value.title,
        duration: this.legalServiceForm.value.duration
      };

      this.legalServices.push(legalService);

      this.hideDialog();
    }
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
