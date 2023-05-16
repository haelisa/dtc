import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LandingpageComponent } from '../landingpage.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent  {

  constructor(public dialogRef: MatDialogRef<LandingpageComponent>) {}


  openQRCodeScanner(){
    
  }

}