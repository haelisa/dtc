import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan-new-qrcode',
  templateUrl: './scan-new-qrcode.component.html',
  styleUrls: ['./scan-new-qrcode.component.css']
})
export class ScanNewQRCodeComponent {

  availableDevices!: MediaDeviceInfo[];
  currentDevice!: MediaDeviceInfo;
  hasDevices!: boolean;
  hasPermission!: boolean;
  qrResultString!: string;

  
  constructor(private _router: Router) { }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device as MediaDeviceInfo;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  btnGoBack(){
    //ToDO: go to waiting Page
    // this._router.navigateByUrl('/scan');
  }
}
