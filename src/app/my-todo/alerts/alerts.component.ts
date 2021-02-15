import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faCalendarTimes, faCheckCircle, faCheckSquare,
  faExclamationTriangle, faMinusSquare,
  faPenSquare, faPlus, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class AlertsComponent implements OnInit {

  @Input() msgType: String;
  @Output() parentDelete = new EventEmitter<any>();
  alertVisible: Boolean;
  validateMsg: String;
  notifySuccess: Boolean;
  notifyFailed: Boolean;
  notifyConfirm: Boolean;
  taskId: any;

  // fontawesome
  faExclamationTriangle = faExclamationTriangle;
  faCheckCircle = faCheckCircle;
  faQuestionCircle = faQuestionCircle;

  constructor() { }

  ngOnInit() {
  }

  alertValidate(validated, success: boolean, validateFlag?: boolean): void {
    this.validateMsg = validated;
    this.alertVisible = true;

    if (success) {
      this.notifySuccess = true;
      this.notifyFailed = false;
      this.notifyConfirm = false;
    } else {
      this.notifyFailed = true;
      this.notifySuccess = false;
      this.notifyConfirm = validateFlag ? false : true
    }

    setTimeout(() => {
      this.alertVisible = false;
    }, 3000);
  }

  alertConfirm(id): void {
    this.alertVisible = true;
    this.notifyConfirm = true;
    this.notifySuccess = false;
    this.validateMsg = 'Are you sure to mark this task as done?';
    this.taskId = id;
  }

  callParent(id): void {
    this.parentDelete.next(id);
    this.alertVisible = false;
  }

  

}
