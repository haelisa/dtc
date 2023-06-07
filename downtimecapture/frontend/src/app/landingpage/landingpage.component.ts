import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';
import axios from 'axios';
import xss from 'xss';
import { Media, MediaFormatEnum, MediaTypeEnum } from '../../modules/media.class';
import { ModalComponent } from './modalsuccess/modal.component';
import { EditImageComponent } from './edit-image-modal/edit-image.component';
import { CanceldtmComponent } from '../canceldtm/canceldtm.component';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css'],
})

export class LandingpageComponent implements OnInit{

  //Data from QR-Code
  equipmentno: string;
  eventid: string;
  timestamp: string;
  name: string;
  surname: string;

  //Check EventId to prevent duplicates
  checkEventId: boolean;

  //Image
  imgToSave: File;
  imgURL: any;
  mediatimestamp: Date;
  mediaType: MediaTypeEnum;
  mediaFormat: MediaFormatEnum;
  mediaObject: Media;
  mediaName: string;
  
  //Data Url to compress
  dataUrl: DataUrl;
  originalBase64: string;
  dialogRef: MatDialogRef<EditImageComponent>;
  compressedImgURL: string;
  imgResultAfterCompression: string = '';

  //Comment
  sanitizedUserInput : string;
  comment: string = '';

  //refresh page safe
  reader: FileReader;

  //Comment maximum number of characters and popup
  charCount: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private client: HttpClient, 
    private dialog : MatDialog,
    private imageCompress: NgxImageCompressService,
    private _router: Router
  ) {}

  ngOnInit() {

    // localStorage.clear();
    // sessionStorage.clear();
    //Data from QR-Code
    this.equipmentno = this.route.snapshot.paramMap.get('equipmentno')!;
    this.eventid = this.route.snapshot.paramMap.get('eventid')!;
    this.name = this.route.snapshot.paramMap.get('name')!;
    this.surname = this.route.snapshot.paramMap.get('surname')!;

    //Convert UnixTimeStamp to Date
    const unixTimestamp = parseInt(this.route.snapshot.paramMap.get('timestamp')!);
    if (!isNaN(unixTimestamp)) {
      const dateObj = new Date(unixTimestamp * 1000); // Convert Unix timestamp to milliseconds
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      const seconds = dateObj.getSeconds().toString().padStart(2, '0');
      const formattedDate = `${day}.${month}.${year}`;
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      this.timestamp = `${formattedDate} ${formattedTime}`;
    }
    
    //Refresh Page -> if Data in Session Storage, display it
    if(sessionStorage.getItem('MediaName') && sessionStorage.getItem('MediaTimeStamp') && sessionStorage.getItem('MediaType') && sessionStorage.getItem('MediaFormat') && localStorage.getItem('MediaBase64')){
      this.mediaName = sessionStorage.getItem('MediaName')!;
      this.mediatimestamp = new Date(sessionStorage.getItem('MediaTimeStamp')!);
      this.mediaType = MediaTypeEnum[sessionStorage.getItem('MediaType')!];
      this.mediaFormat = MediaFormatEnum[sessionStorage.getItem('MediaFormat')!];
      this.imgURL = localStorage.getItem('MediaBase64')!;
      this.originalBase64 = sessionStorage.getItem('OriginalBase64')!;
    }
    if(sessionStorage.getItem('landingPageComment')){
      this.comment = sessionStorage.getItem('landingPageComment')!;
      this.charCount = this.comment.length;
    }
  
    //Get method to check if the eventID already exisits in database   
    const ip = window.location.hostname;
    axios.get(`http://${ip}:3000/dtm/checkEventID/${this.eventid}`).then(response =>{
      console.log('Response from Backend, EventID already exists: ' , response.data);
      if(response.data){
        let dialogRef = this.dialog.open(CanceldtmComponent,  { disableClose: true });
      }

      this.checkEventId = response.data
      console.log(this.checkEventId); // this.checkEventId above initialized as boolean, so you can work with it in the whole class
    });

    //Disable scroll refresh and "Go back" gesture (Chrome for Android)
    window.addEventListener('touchmove', function(event) {
      const threshold = 5; // Adjust this value to control the sensitivity of scrolling
      const touch = event.touches[0];
      const startY = touch.clientY;
      const startX = touch.clientX;
    
      function handleTouchMoveY(event: TouchEvent) {
        const currentY = event.touches[0].clientY;
        const deltaY = currentY - startY;
    
        if (Math.abs(deltaY) >= threshold|| currentY < window.innerHeight / 3) {
          event.preventDefault();
        }
      }

      function handleTouchMoveX(event) {
        const currentX = event.touches[0].clientX;
        const deltaX = currentX - startX;
    
        if (Math.abs(deltaX) >= threshold || currentX < window.innerWidth / 3) {
          event.preventDefault();
        }
      }
    
      window.addEventListener('touchmove', handleTouchMoveY, { passive: false });
      window.addEventListener('touchmove', handleTouchMoveX, { passive: false });
    
      function handleTouchEnd() {
        window.removeEventListener('touchmove', handleTouchMoveY);
        window.removeEventListener('touchmove', handleTouchMoveX);
        window.removeEventListener('touchend', handleTouchEnd);
      }
    
      window.addEventListener('touchend', handleTouchEnd);
    }, { passive: false });
  }

  //Compress Image with Size larger than 5 MB
  async compressImage(dataUrl: string){
    console.log(this.imageCompress.byteCount(dataUrl));
    await this.imageCompress
    .compressFile(dataUrl, 1, 50, 50) // 50% ratio, 50% quality
    .then(compressedImage => {
        this.imgResultAfterCompression = compressedImage;
        console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
    });
  }

  //Button ScanAnotherQRCode
  scanAnotherQRCode(){
    const confirmation = confirm("Do you want to scan another QR-Code? All your changes will be deleted.");

    if (confirmation) {
      sessionStorage.clear();
      localStorage.clear();
      this._router.navigateByUrl('/scan');
    }
  }

  //Take photo, pass photo time stamp as well as name
  preview(files:any) {
    if(!sessionStorage.getItem('MediaName') && !sessionStorage.getItem('MediaTimeStamp') && !sessionStorage.getItem('MediaType') && !sessionStorage.getItem('MediaFormat') && !localStorage.getItem('MediaBase64')){
      if (files.length === 0){
        return;
      }

      //Check if file was saved in variable and it is an image
      var mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        alert("Only the image formats jpeg, png and jpg are allowed.");
        return;  
      }    

      //Call HTML-Input-Elements 
      const captureImgInput = document.getElementById("captureimg") as HTMLInputElement;
      const galeryImgInput = document.getElementById("galeryimg") as HTMLInputElement;
      
      let file: File | null = null;
      // let mediaType: MediaTypeEnum | null = null;

      if (captureImgInput.files && captureImgInput.files[0]) {
        file = captureImgInput.files[0];
        this.mediaType = MediaTypeEnum.AUFNAHME;
      } else if (galeryImgInput.files && galeryImgInput.files[0]) {
        file = galeryImgInput.files[0];
        this.mediaType = MediaTypeEnum.GALERIE;  
      }
      this.mediaFormat = MediaFormatEnum.FOTO;
      if (!file) {
        return;
      }
            
      //Only common formats allowed
      if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
        alert("Only the image formats jpeg, png and jpg are allowed.");
        return;
      }
        
      //Photo larger than 5MB
      if (file.size > 5 * 1024 * 1024) {
        const compressreader = new FileReader();
        compressreader.readAsDataURL(files[0]);
        compressreader.onloadend = () => {
          this.imgURL = compressreader.result as string;
          this.compressImage(this.imgURL);
        }
        
      }

      //Photo older than 12 hours
      const ageInMs = Date.now() - file.lastModified;
      const ageInHours = ageInMs / (1000 * 60 * 60);
      // if (ageInHours > 12) {
      //   alert("The photo must not be older than 12 hours.");
      //   return;
      // }

      //Cache TimeStamp
      this.mediatimestamp = new Date(file.lastModified);

      this.imgToSave = file;
      this.mediaName = this.imgToSave.name;
      console.log(this.imgToSave.name);

      //Open Image Editor Popup, after close get 
      const imgreader = new FileReader();
      imgreader.readAsDataURL(files[0]);
      imgreader.onloadend = () => {
        this.imgURL = imgreader.result as string;
        this.originalBase64 = this.imgURL;
        sessionStorage.setItem('OriginalBase64', this.originalBase64);
        localStorage.setItem('MediaBase64', this.imgURL);
          
        this.dialogRef = this.dialog.open(EditImageComponent, {
          height: '100vh',
          maxWidth: '100vw',
          disableClose: true,
          data: {
            dataUrl: this.imgURL
          }
        });

        this.dialogRef.afterClosed().subscribe(
          data => {
            if(data.dataurl != ''){
              this.imgURL = data.dataurl;
              localStorage.setItem('MediaBase64', this.imgURL);
              
            }else{
              galeryImgInput.value = '';
            }
          }
        );
      }

      const formData = new FormData();
      formData.append("photo", file);
      
      //Save data in SessionStorage
      sessionStorage.setItem('MediaName', this.mediaName );
      sessionStorage.setItem('MediaTimeStamp', this.mediatimestamp.toString());
      sessionStorage.setItem('MediaType', this.mediaType);
      sessionStorage.setItem('MediaFormat', this.mediaFormat);
    }
  }

  //Edit Button: edit original photo again 
  editImage() {
    const dialogRef = this.dialog.open(EditImageComponent, {
      height: '100vh',
      maxWidth: '100vw',
      disableClose: true,
      data: {
        dataUrl: this.originalBase64
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.dataurl !== '') {
          this.imgURL = data.dataurl;
          
          localStorage.removeItem('MediaBase64');
          localStorage.setItem('MediaBase64', this.imgURL);
      }
    });
  }

  // Delete Button: Photo preview, photo timestamp, comment content
  deleteImage() {
    const confirmation = confirm("Do you want to delete the photo?");

    if (confirmation) {
      this.imgURL = null;

      //Delete photo
      const inputs = ["captureimg", "galeryimg"];
      inputs.forEach((input) => {
        const element = document.getElementById(input) as HTMLInputElement;
        if (element) {
          element.value = "";
        }
      });

      this.mediatimestamp=  null as unknown as Date;  //Delete photo Timestamp
    
      console.log('Media deleted successfully.');

      //Remove Image from SessionStorage
      sessionStorage.removeItem('MediaName');
      sessionStorage.removeItem('MediaTimeStamp');
      sessionStorage.removeItem('MediaType');
      sessionStorage.removeItem('MediaFormat');
      localStorage.removeItem('MediaBase64');
      sessionStorage.removeItem('OriginalBase64')!;
    }
  }

  updateCharCount(event: any) {
    const input = event.target.value;
    const textarea = document.getElementById('commentfield') as HTMLTextAreaElement;
      if (input.length > 300) {
      event.target.value = input.substring(0, 300);
      this.charCount = 300;
      alert('Limit of 300 characters has been exceeded');
      textarea.scrollTop = 0;
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
    } else {
      this.charCount = input.length;
      //Save Comment in SessionStorage on change
      sessionStorage.setItem("landingPageComment", this.comment);
    }  
  }

  async onSubmit(){

    const ip = window.location.hostname;

    //Create media object to pass into the post method of the downtime message
    this.mediaObject = new Media();
    this.mediaObject.mediaName = this.mediaName;
    this.mediaObject.mediaTimeStamp = this.mediatimestamp;
    this.mediaObject.MediaType = this.mediaType;
    this.mediaObject.MediaFormat = this.mediaFormat;
    this.mediaObject.mediaFile = this.imgURL;

    //Convert Date back to UnixTimeStamp for storage in database
    const [day, month, year, hours, minutes, seconds] = this.timestamp.split(/[.: ]/).map(Number);
    const dateObj = new Date(year, month - 1, day, hours, minutes, seconds);
    const unixTimestamp = Math.floor(dateObj.getTime() / 1000);
    console.log(unixTimestamp);

    //Post method to send the downtime message to the backend
    const requestDataDtm = {
      dtmComment: xss(this.comment), //XSS sanitized Comment
      dtmTimeStamp: unixTimestamp,
      dtmEquipmentNo: this.equipmentno,
      dtmEventid: this.eventid,
      dtmName: this.name,
      dtmSurname: this.surname,
      mediaObject: this.mediaObject
    }

    this.client.post(`http://${ip}:3000/dtm/createDtm`, requestDataDtm).subscribe(() => {

      //Open Modal for send successful
      console.log('Downtime Message saved successfully.');
      let dialogRef = this.dialog.open(ModalComponent,  { disableClose: true });

    }, (error) => {
      console.error('Error while saving Downtime Message:', error);
    }); 

    //Remove Item from SessionStorage
    sessionStorage.removeItem('MediaName');
    sessionStorage.removeItem('MediaTimeStamp');
    sessionStorage.removeItem('MediaType');
    sessionStorage.removeItem('MediaFormat');
    localStorage.removeItem('MediaBase64');
    sessionStorage.removeItem('OriginalBase64')!;
    sessionStorage.removeItem('landingPageComment');
    this.comment = '';
  }
  
}