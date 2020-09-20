import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Inject } from '@angular/core';
import { DataGetService } from '../shared/data-get.service';
import { IEvent } from '../interfaces/event'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private dataGetService: DataGetService, public dialog: MatDialog) { }

  name : String;
  public curr_event_id : String;

  ngOnInit() {

    var data_input : IEvent = {
      event_name: 'Recretional Outing',
      event_description: 'For Eric\'s Birthday',
      time: new Date(),
      category: this.dataGetService.category,
      attendees: ['Eric', 'Sky', 'Solomon', 'Alex'],
      coord_lat: 42.296650,
      coord_lon: -83.721287
    };

    this.dataGetService.getCategories();
    // this.dataGetService.createEvent(data_input);

    var hello = this.dataGetService.getEvents();
    console.log(hello);
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