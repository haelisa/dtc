import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LandingpageComponent } from '../landingpage/landingpage.component';

@Component({
  selector: 'app-canceldtm',
  templateUrl: './canceldtm.component.html',
  styleUrls: ['./canceldtm.component.css']
})

export class CanceldtmComponent {
  constructor(
    public dialogRef: MatDialogRef<LandingpageComponent>,
    private _router: Router
  ) {}

  openQRCodeScanner(){
    this._router.navigateByUrl('/scan');
  }
  
}