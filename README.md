# Infinite Scroll in Angular

## Here we are building infinite scroll of images without any libraries

### `We will build infinite scroll of images by two methods :-`
### 1. Using window scroll event
1) First of all create new angular app using `ng new infinite-scroll`.
2) In the app create new service `ng s image` which we will use to call http methods to get images from pexels api, sign in to pexels to get your authorization key.

`image.service.ts`
```ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  pendingReq: boolean = false;
  apiUrl: string = 'https://api.pexels.com/v1/curated';
  constructor(private http: HttpClient) {}

  getItems(page: number, perPage: number) {
    if (this.pendingReq) {
      return {} as Observable<{}>;
    }
    this.pendingReq = true;
    const url = `${this.apiUrl}?per_page=${perPage}&page=${page}`;
    this.pendingReq = false;
    return this.http.get<any>(url).pipe(delay(3000));
  }
}
```

3) You also need to generate Http interceptor called AuthInterceptor. Interceptors allow us to intercept and modify HTTP requests and responses. In this case, the interceptor is used to add an authorization header to every outgoing HTTP request because you need authorization key to every request to pexels api.

`environment.ts`
```ts
export const environment = {
    production:false,
    pexelsApiKey:'your authorization key'
};

```

`auth.interceptor.ts`
```ts 
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders:{
        Authorization:environment.pexelsApiKey
      }
    })
    return next.handle(request);
  }
}
```
By using this interceptor, the Authorization header is automatically added to every outgoing HTTP request, ensuring proper authentication with the server.

4) We also want a component to render images we get from api, generate a component `ng g c image-list`.I used **Tailwind CSS** for styling.

`image-list.component.html`
```html
<div class="item-list grid gap-2 grid-cols-1 lg:grid-cols-3 mx-auto my-2 w-full" >
    <div *ngFor="let item of items" class="img-container w-full mx-auto rounded-md border">
        <img class="img h-full w-full rounded-md object-cover" [src]="item.src.large" alt="" crossorigin>
    </div>
</div>

<div *ngIf="isLoading" #lastItem class="flex justify-center">
    Loading...
</div>
```
`image-list.component.ts`
```ts
import { Component, HostListener, OnInit } from '@angular/core';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
})
export class ImageListComponent implements OnInit {
  items: any[] = []; // is an array that will store the loaded items (images).
  page = 1;// represents the current page number for pagination.
  perPage = 25; // represents the number of items to load per page.
  isLoading:boolean=false; // is a boolean flag to track whether new items are being loaded.

  constructor(private imageService: ImageService) {}
  ngOnInit(): void {
    this.loadItems();
  }
  @HostListener('window:scroll',['$event'])
  onWindowScroll(event:any){
    
    if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading){
      console.log(event);
      this.loadItems()
    }
  }
  loadItems() {
    this.isLoading=true;
    this.imageService.getItems(this.page, this.perPage).subscribe((items) => {
      this.items.push(...items.photos)
      console.log(items);
      this.page++
      this.isLoading=false
    });
  }
}
```
**@HostListener('window:scroll', ['$event'])**: This decorator attaches a scroll event listener to the window. It listens for the 'scroll' event and triggers the onWindowScroll function when the event occurs.

**onWindowScroll(event: any)**: This function is called when the user scrolls the window. It checks if the user has reached the bottom of the page by comparing the sum of the viewport height and scroll position with the total height of the document. If the condition is true and no items are currently being loaded, it calls the loadItems() function to fetch more items.

`if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading)`: This is an if statement that checks two conditions:

`window.innerHeight+window.scrollY` calculates the total height of the viewport by summing the height of the visible portion of the window (window.innerHeight) and the vertical scroll position of the window (window.scrollY).
`document.body.offsetHeight` represents the total height of the document, including any overflow content.
!this.isLoading checks if isLoading is false (i.e., no items are currently being loaded).
The if statement checks if the user has scrolled to the bottom of the page by comparing the total height of the viewport with the total height of the document. It also ensures that no items are currently being loaded. If both conditions are met, the code inside the if statement will execute.

**loadItems()**: This function is responsible for loading new items (images). It sets the isLoading flag to true to indicate that new items are being loaded. Then, it calls the getItems() method of the imageService, passing the current page and perPage values. It subscribes to the returned Observable to receive the loaded items. Once the items are received, they are appended to the items array using the spread operator (...). The page value is incremented to fetch the next page in subsequent requests, and the isLoading flag is set to false to allow new requests.

**imageService.getItems(page: number, perPage: number)**: This method is part of the ImageService and is responsible for fetching items (images) from a data source. It takes the page and perPage values as parameters and returns an Observable that emits the loaded items.

5) Now add the component `app-image-list` to `app.component.html`
```html
<app-image-list></app-image-list>
```

We build infinite scroll in angular without any library. Now we will build with the next method.



This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
