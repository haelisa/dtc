import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LandingpageComponent } from '../landingpage.component';
import { Router } from '@angular/router'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent  {

  constructor(
    public dialogRef: MatDialogRef<LandingpageComponent>,
    private _router: Router
  ) {}

  openQRCodeScanner(){
    this._router.navigateByUrl('/scan');
  }

  routeToWaiting(){
    this._router.navigateByUrl('/start');
  }
}