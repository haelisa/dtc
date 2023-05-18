import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { LandingpageComponent } from '../landingpage.component';

import { ImageDrawingComponent, ImageDrawingModule } from 'ngx-image-drawing';
import { DataUrl } from 'ngx-image-compress';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css']

})
export class EditImageComponent {

imageUrl = '';
editedImgUrl = '';

  constructor(
    public dialogRef: MatDialogRef<EditImageComponent>,
    // private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.imageUrl = data.dataUrl;
  }

  saveImage(editedImage: Blob) {
    // Handle the edited image here
    // editedImage parameter contains the base64 data URL of the edited image
    // You can perform further processing or send it to the server
    var reader = new FileReader();
    reader.readAsDataURL(editedImage); 
    reader.onload = (_event) => { 
      
      this.editedImgUrl = reader.result!.toString();
      // alert(this.editedImgUrl);
      this.dialogRef.close(this.editedImgUrl);
    }
    
  }

  cancelImage() {
    // Clear the image URL and file
    // this.imageUrl = '';
    // this.imageFile = ne w File([], '');
      this.dialogRef.close();
  }
}



