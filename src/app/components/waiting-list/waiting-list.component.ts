import { Component } from '@angular/core';
import { DatePipe, NgForOf } from "@angular/common";

import { Subscription } from "rxjs";

import { WaitingListEntity } from "../../../../progetto_shared/waitingListEntity.type";
import { AppointmentService } from "../../services/appointment/appointment.service";

@Component({
  selector: 'app-waiting-list',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './waiting-list.component.html',
  styleUrl: './waiting-list.component.scss'
})
export class WaitingListComponent {

  waitingList: WaitingListEntity[] = [];

  constructor(private appointmentService: AppointmentService) {
    const subscription: Subscription = this.appointmentService.getWaitingLists().subscribe({
      next: (result: WaitingListEntity[]) => this.waitingList = result,
      error: err => console.log(err),
      complete: () => subscription.unsubscribe()
    });
  }
}
