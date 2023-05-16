import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LandingpageComponent } from '../landingpage.component';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css']
})
export class EditImageComponent {

  constructor(public dialogRef: MatDialogRef<LandingpageComponent>) {}




//Aufruf in Landing page mit:
// let dialogRef = this.dialog.open(ModalComponent, {
  // height: '100vh', für Vollbild
  // width: '100vvw' für Vollbild
// });


}
