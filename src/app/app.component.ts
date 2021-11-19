import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContainersService } from 'src/app/containers.service';
import { ImagesService } from 'src/app/images.service';
import { ContainerResponse } from './models/container-response';
import { ContainerRequest } from './models/container-request';
import { ImageRequest } from './models/image-request';
import { ImageResponse } from './models/image-response';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Container Manager';
  angForm: FormGroup;
  imageForm: FormGroup;
  _isDisabled = false;
  container = {} as ContainerResponse
  containerRequest = {} as ContainerRequest
  containers: ContainerResponse[];
  image = {} as ImageResponse
  imageRequest = {} as ImageRequest
  images: ImageResponse[];

  constructor(private fb: FormBuilder, private imageService: ImagesService, private containerService: ContainersService) {
    this.createContainerForm();
    this.createImageForm();
  }

  ngOnInit() {
    this.findAllImages();
    this.findAllContainers()
    console.log(environment.test)
  }


  createContainerForm() {
    this.angForm = this.fb.group({
      transferId: [{ value: 0, disabled: this._isDisabled }, [Validators.pattern("^[0-9]*$"), Validators.min(0)]],
      imageNameTag: ['', Validators.required],
      containerPort: ['', Validators.pattern("[0-9]+:[0-9]+")],
      containerEnvFull: ['',Validators.pattern("(([A-Za-z0-9_]+=[A-Za-z0-9_]+),?)+")],
      containername: ['',''],      
    });
  }

  createImageForm(){
    this.imageForm = this.fb.group({
      imageName: ['', Validators.required],
      imageTag: ['',''],
    })
  }

  isDisabled() {
    if (this._isDisabled) {
      this.angForm.controls['transferId'].enable();
      this._isDisabled = false;
    } else {
      this.angForm.controls['transferId'].disable();
      this.angForm.controls['transferId'].setValue(0);
      this._isDisabled = true;
    }
  }

  public findAllImages(): void {
    this.imageService.getAll().subscribe((data: ImageResponse[])=>{
      this.images = data;
    })  
  }

  public findAllContainers(): void {
    this.containerService.getAll().subscribe((data: ContainerResponse[])=>{
      this.containers = data;
    })  
  }


  public deleteImageById(imageId: string): void {
    this.imageService.deleteById(imageId).subscribe(() => {
      this.findAllImages();
    })
  }
  
  public deleteContainerById(imageId: string): void {
    this.containerService.deleteById(imageId).subscribe(() => {
      this.findAllContainers();
    })
  }

  public deleteAllContainers(): void {
    this.containerService.deleteAll().subscribe(() => {
      this.findAllContainers();
    })
  }

  public deleteAllImages(): void {
    this.imageService.deleteAll().subscribe(() => {
      this.findAllContainers();
    })
  }

  public findImageById(imageID: string): void {
    this.imageService.getById(imageID).subscribe((data: ImageResponse) =>{
      this.image = data;
      // console.log(this.image);      
    });
  }  
  
  public findContainerById(containerId: string): void {
    this.containerService.getById(containerId).subscribe((data: ContainerResponse) =>{
      this.container = data;
      // console.log(this.image);      
    });
  }
  
  public runContainer(): void{
    this.containerService.run(this.containerRequest).subscribe(() => {
      this.findAllContainers();
      this.findAllImages();
    });
    this.angForm.reset()
  }

  public pullImage(): void {
    this.imageService.pull(this.imageRequest).subscribe(() => {
      this.findAllImages();
    });
    this.angForm.reset()
  }

  public enableButton(): boolean{
    return true
  }


  //UTILS

  public extractPort(object: Object): string{
    try {
      return object["Ports"] != null ? Object.entries(object["Ports"])[0][1][0]["HostPort"] + ":" + Object.entries(object["Ports"])[0][0] : "null"      
    } catch (error) {
      return "null"
    }
  }

  public extractLink(object: Object): string{
    try {
      return object["Ports"] != null ? environment.dockerHost + Object.entries(object["Ports"])[0][1][0]["HostPort"] : ""      
    } catch (error) {
      return "null"
    }
  }
}