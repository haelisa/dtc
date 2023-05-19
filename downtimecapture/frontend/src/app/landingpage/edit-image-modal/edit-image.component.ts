import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ImageDrawingComponent, ImageDrawingModule } from 'ngx-image-drawing';


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
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.imageUrl = data.dataUrl;
  }

  saveImage(editedImage: Blob) {
    // Handle the edited image here
    var reader = new FileReader();
    reader.readAsDataURL(editedImage); 
    reader.onload = (_event) => { 
      this.editedImgUrl = reader.result!.toString();
      this.dialogRef.close({dataurl: this.editedImgUrl});
    }
    
  }

  cancelImage() {
    // Clear the image URL and file
    this.dialogRef.close({dataurl: ''});
  }
}



