import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { EventEmitter, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { fabric } from 'fabric';
import { I18nEn, I18nInterface, i18nLanguages } from './i18n';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css']

})
export class EditImageComponent implements OnInit, OnChanges {

  constructor(
    public dialogRef: MatDialogRef<EditImageComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.src = data.dataUrl;
  }

  borderCss: string = 'none';
  @Input() public src?: string;
  @Input() public width?= 310;
  @Input() public height?= 375;

  @Input() public forceSizeCanvas = false;
  @Input() public forceSizeExport = false;
  @Input() public enableRemoveImage = false;
  @Input() public enableLoadAnotherImage = false;
  @Input() public enableTooltip = true;
  @Input() public showCancelButton = true;

  // @ts-ignore
  @Input('i18n') public i18nUser: I18nInterface;
  @Input() public locale: string = 'en';
  /* @deprecated Use i18n.saveBtn */
  @Input() public saveBtnText = 'Save';
  /* @deprecated Use i18n.cancelBtn */
  @Input() public cancelBtnText = 'Cancel';
  /* @deprecated Use i18n.loading */
  @Input() public loadingText = 'Loading…';
  /* @deprecated Use i18n.loadError */
  @Input() public errorText = 'Error loading %@';

  loadingTemplate?: TemplateRef<any>;
  errorTemplate?: TemplateRef<any>;

  outputMimeType = 'image/jpeg';
  outputQuality = 0.8;

  drawingSizes: { [name: string]: number } = {
      small: 5,
      medium: 9,
      large: 12,
  };
  
  colors: { [name: string]: string } ={
      black: '#000',
      white: '#fff',
      yellow: '#ffeb3b',
      red: '#f44336',
      blue: '#2196f3',
      green: '#4caf50',
      purple: '#7a08af',
  };

  public currentTool = 'brush';
  public currentSize = 'medium';
  public currentColor = 'black';
  public i18n: I18nInterface = I18nEn;

  public canUndo = false;
  public canRedo = false;

  public isLoading = false;
  public hasError = false;
  public errorMessage = '';

  private canvas!: fabric.Canvas;
  private stack: fabric.Object[] = [];

  public colorsName: string[] = [];
  public drawingSizesName: string[] = [];

  private imageUsed?: fabric.Image;


  public ngOnInit(): void {

      this.colorsName = Object.keys(this.colors);
      this.drawingSizesName = Object.keys(this.drawingSizes);

      this.canvas = new fabric.Canvas('canvas', {
          hoverCursor: 'pointer',
          isDrawingMode: true,
      });
      this.canvas.backgroundColor = 'white';
      
      this.importPhotoFromSrc(this.src as string);

      this.canvas.on('path:created', () => {
          this.stack = [];
          this.setUndoRedo();
      });

      this.selectTool(this.currentTool);
      this.selectColor(this.currentColor);
      this.selectDrawingSize(this.currentSize);

      if (this.locale && i18nLanguages[this.locale.toLowerCase()]) {
          this.i18n = i18nLanguages[this.locale.toLowerCase()];
      }

      // FIXME remove after a while because properties are now deprecated
      if (this.saveBtnText) {
          this.i18n.saveBtn = this.saveBtnText;
      }
      if (this.cancelBtnText) {
          this.i18n.cancelBtn = this.cancelBtnText;
      }
      if (this.loadingText) {
          this.i18n.loading = this.loadingText;
      }
      if (this.errorText) {
          this.i18n.loadError = this.errorText;
      }

  }

  // Tools
  public selectTool(tool: string) {
      this.currentTool = tool;
  }

  public selectDrawingSize(size: string) {
      this.currentSize = size;
      if (this.canvas) {
          this.canvas.freeDrawingBrush.width = this.drawingSizes[size];
      }
  }

  public selectColor(color: string) {
      this.currentColor = color;
      if (this.canvas) {
          this.canvas.freeDrawingBrush.color = this.colors[color];
      }
  }

  // Actions
  public undo() {
      if (this.canUndo) {
          const lastId = this.canvas.getObjects().length - 1;
          const lastObj = this.canvas.getObjects()[lastId];
          this.stack.push(lastObj);
          this.canvas.remove(lastObj);
          this.setUndoRedo();
      }
  }

  public redo() {
      if (this.canRedo) {
          const firstInStack = this.stack.splice(-1, 1)[0];
          if (firstInStack) {
              this.canvas.insertAt(firstInStack, this.canvas.getObjects().length - 1, false);
          }
          this.setUndoRedo();
      }
  }

  public clearCanvas() {
      if (this.canvas) {
          this.canvas.remove(...this.canvas.getObjects());
          this.setUndoRedo();
      }
  }

  //Button Save
  public saveImage() {
        const canvasNew = this.canvas.getElement() as HTMLCanvasElement;
        const dataurlbase64 = canvasNew.toDataURL("image/jpeg");
        this.dialogRef.close({dataurl: dataurlbase64});
  }

  //Button Cancel
  public cancelAction() {
      this.dialogRef.close({dataurl: ''});
  }

  public getTextTranslated(name: string): string {
      let strOk = name.split('.').reduce((o, i) => o[i], this.i18n as any);

      if (this.i18nUser) {
          try {
              const str = name.split('.').reduce((o, i) => o[i], this.i18nUser as any);
              if (str) {
                  strOk = str;
              }
          } catch (e) {
              // if we pass here, ignored
          }
      }

      if (!strOk) {
          console.error(name + ' translation not found !');
      }

      return strOk;
  }

  public getTooltipTranslated(name: string): string {
      if (this.enableTooltip) {
          return this.getTextTranslated(name)
      } else {
          return '';
      }
  }

  private setUndoRedo() {
      this.canUndo = this.canvas.getObjects().length > 0;
      this.canRedo = this.stack.length > 0;
      // this.canvas.renderAll();
  }

  public importPhotoFromFile(event: Event | any) {
      if (event.target.files && event.target.files.length > 0) {
          const file = event.target.files[0];
          if (file.type.match('image.*')) {
              this.importPhotoFromBlob(file);
          } else {
              throw new Error('Not an image !');
          }
      }
  }

  public removeImage() {
      if (this.imageUsed) {
          this.imageUsed.dispose();
          this.imageUsed ;
      }
      this.canvas.backgroundImage ;

      if (this.width && this.height) {
          this.canvas.setWidth(this.width);
          this.canvas.setHeight(this.height);
      }

      this.canvas.renderAll();
  }

  public get hasImage(): boolean {
      return !!this.canvas.backgroundImage;
  }

  private importPhotoFromSrc(src: string) {
      this.isLoading = true;
      let isFirstTry = true;
      const imgEl = new Image();
      imgEl.setAttribute('crossOrigin', 'anonymous');
      imgEl.src = src;
      imgEl.onerror = () => {
          // Retry with cors proxy
          if (isFirstTry) {
              imgEl.src = 'https://cors-anywhere.herokuapp.com/' + this.src;
              isFirstTry = false;
          } else {
              this.isLoading = false;
              this.hasError = true;
              this.errorMessage = this.getTextTranslated('loadError').replace('%@', this.src as string);
          }
      };
      imgEl.onload = () => {
          this.isLoading = false;
          this.imageUsed = new fabric.Image(imgEl);

          this.imageUsed.cloneAsImage(image => {

            let width = imgEl.width;
            let height = imgEl.height;


            //dddd
            if(width > height){
              if (this.width) {
                width = this.width;
              }
              image.scaleToWidth(this.width, false);

            }else if(width < height){
              if (this.height) {
                height = this.height;
              }
              image.scaleToHeight(this.height, false);
            }else{
              this.width = 350;
              this.height = 350;
              image.scaleToWidth(this.width, false);
              image.scaleToHeight(this.height, false);
            }

            this.canvas.setBackgroundImage(image, ((img: HTMLImageElement) => {
                if (img) {
                        this.canvas.setHeight(image.getScaledHeight());
                        this.canvas.setWidth(image.getScaledWidth());
                }
            }), {
                crossOrigin: 'anonymous',
                originX: 'left',
                originY: 'top'
            });
            
            this.borderCss = '1px solid';
          });
      };
  }

  private importPhotoFromBlob(file: Blob | File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evtReader: any) => {
          if (evtReader.target.readyState == FileReader.DONE) {
              this.importPhotoFromSrc(evtReader.target.result);
          }
      };
  }

  public importPhotoFromUrl() {
      const url = prompt(this.getTooltipTranslated('loadImageUrl'));
      if (url) {
          this.importPhotoFromSrc(url);
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['src'] && !changes['src'].firstChange && changes['src'].currentValue) {
          if (typeof changes['src'].currentValue === 'string') {
              this.importPhotoFromSrc(changes['src'].currentValue);
          } else if (changes['src'].currentValue instanceof Blob) {
              this.importPhotoFromBlob(changes['src'].currentValue);
          }
      }
  }
}