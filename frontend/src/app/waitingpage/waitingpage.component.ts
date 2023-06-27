import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waitingpage',
  templateUrl: './waitingpage.component.html',
  styleUrls: ['./waitingpage.component.css']
})

export class WaitingpageComponent {

  constructor(
    private _router: Router
  ) {}

  scanAnotherQRCode(){
    this._router.navigateByUrl('/scan');
  }

}