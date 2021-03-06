import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { DataGetService } from '../shared/data-get.service';
import { Subject } from 'rxjs';
import { IEvent } from '../interfaces/event'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  constructor(public dataGetService: DataGetService, public dialog: MatDialog,private cdr: ChangeDetectorRef) { }

  name : String;
  public curr_event_id : String;
  
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.dataGetService.getCategories();

    // this.dataGetService.createEvent(data_input);
  }

  openJoinDialog(current_event): void {
    this.curr_event_id = current_event
    const dialogRef = this.dialog.open(joinGroupDialog, {
      width: '250px',
      data: this.curr_event_id
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.name = result;
      
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(createGroupDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.name = result;
    });
  }
}


@Component({
  selector: 'join-group-dialog',
  templateUrl: 'join-group-dialog.html',
})
export class joinGroupDialog {
  name_dialog : String;
  curr_event_id_dialog : String;

  constructor(
    public dialogRef: MatDialogRef<joinGroupDialog>,
    private dataGetService: DataGetService,
    @Inject(MAT_DIALOG_DATA) public new_event_id: string) {}

  onNoClick(): void {
    this.dialogRef.close();
    this.dataGetService.getEvents();
  }

  actualClick(): void {
    this.curr_event_id_dialog = this.new_event_id;
    this.dataGetService.updateEvent(this.curr_event_id_dialog, this.name_dialog)
    this.dialogRef.close();
    this.dataGetService.getEvents();
  }
}

@Component({
  selector: 'create-group-dialog',
  templateUrl: 'create-group-dialog.html',
})
export class createGroupDialog {
  name_dialog : String;

  constructor(
    public dialogRef: MatDialogRef<createGroupDialog>,
    private dataGetService: DataGetService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
    this.dataGetService.getEvents();
  }

  actualClick(): void {

    var name_input;
    var event_name_input;
    var event_description_input;
    var event_time_input;
    var coord_lat;
    var coord_lon;
    var address_input;

    this.dataGetService.getLatLon(address_input);


    var data_input : IEvent = {
      event_name: event_name_input,
      event_description: event_description_input,
      time: event_time_input,
      category: this.dataGetService.category,
      attendees: [name_input],
      coord_lat: 42.296650,
      coord_lon: -83.721287,
      address: '1780 Broadway St, Ann Arbor, MI 48105'
    };
    this.dataGetService.createEvent(data_input)
    this.dialogRef.close();
    this.dataGetService.getEvents();
  }
}