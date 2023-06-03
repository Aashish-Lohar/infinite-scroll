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


## 2. Using Intersection Observer API

1) For this method we need to create directive using cli command `ng g d intersection-listener`
and in directive add below code.

`intersection-listener.directive.ts`
```ts
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {} from 'rxjs';

@Directive({
  selector: '[appIntersectionListener]',
})
export class IntersectionListenerDirective implements AfterViewInit, OnInit {

  @Output() appIntersectionListener = new EventEmitter<boolean>();
  observer!: IntersectionObserver;//  It will be used to observe changes in the intersection of an element with its parent container.

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.intersectionObserver();
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.element.nativeElement);
  }

  intersectionObserver() {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log('scroll more');
        this.appIntersectionListener.emit(true);
      }
    }, options);
  }
}
```
`ElementRef`class, which represents a reference to the host element to which the directive is applied.
`ngAfterViewInit(): void`: This method is an Angular lifecycle hook that is called after the view has been initialized. It is used to start observing the intersection of the host element with its parent container.
`intersectionObserver()`:This is a custom method that sets up the IntersectionObserver. It creates an observer with specified options, including the root element, root margin, and threshold. The observer listens for changes in intersection and triggers a callback function when an intersection occurs. If the observed element is intersecting with its parent container, it logs a message to the console and emits true through the appIntersectionListener event emitter.

**Let's break down the`intersectionObserver`function in detail:**
```js
let options = { root: null, rootMargin: '0px', threshold: 0.5 }; 
```
The above line declares an options object that defines the configuration for the IntersectionObserver. The options specify the root element (the element that is used as the viewport for checking visibility), the root margin (a margin around the root element's bounding box), and the threshold (the percentage of the target element's visibility needed for the intersection to be considered).
```ts
this.observer = new IntersectionObserver((entries) => { ... }, options);
```
The above line creates a new IntersectionObserver object. The observer takes a callback function as the first argument, which is executed whenever an observed element's intersection with the root changes. The second argument is the options object defined earlier.

`(entries) => { ... }` the callback function that is executed when the intersection of the observed element with the root changes. It takes an array of entries as a parameter. Each entry in the array represents an observed element and provides information about its intersection with the root.

`if (entries[0].isIntersecting) { ... }` : This line checks if the first entry in the entries array (which corresponds to the observed element) is currently intersecting with the root element. The isIntersecting property indicates whether the observed element is visible within the root element or not.

`this.appIntersectionListener.emit(true);`: This line emits a true value through the appIntersectionListener output property. It triggers an event that can be listened to by the parent component. By emitting true, it indicates that the observed element has intersected with the root and additional scrolling or loading actions may be necessary.

**Now our directive code is done, we can move to next step**
2) For this method we will use tha same service `image.service.ts` to get images as in First method. We also need to create another component to implement infinite scroll of images `image-list2.component`.

`image-list2.component.ts`
```ts
import {
  Component
  OnInit
} from '@angular/core';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-list2',
  templateUrl: './image-list2.component.html',
  styleUrls: ['./image-list2.component.scss'],
})
export class ImageList2Component implements OnInit, AfterViewInit {

  items: any[] = [];
  page = 1;
  perPage = 25;
  isLoading: boolean = false;
  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.isLoading = true;
    this.imageService.getItems(this.page, this.perPage).subscribe((items) => {
      this.items.push(...items.photos);
      console.log(items);
      this.page++;
      this.isLoading = false;
    });
  }
}
```

`image-list2.component.html`
```html
<div class="item-list grid gap-2 grid-cols-1 lg:grid-cols-3 mx-auto my-2 w-full" >
    <div *ngFor="let item of items; let i=index" class="img-container w-full  mx-auto rounded-md border">
        <img (appIntersectionListener)="loadItems()"  *ngIf="i+1===items.length" class="img h-full w-full rounded-md object-cover" [src]="item.src.large" alt="" crossorigin>
        <img  *ngIf="i+1!=items.length" class="img h-full w-full rounded-md object-cover" [src]="item.src.large" alt="" crossorigin>
    </div>
</div>
<div *ngIf="isLoading" class="flex justify-center">
   Loading...
</div>
```
In above html we can observe that there is a div element with the class `img-container` looping through the items array, in div we have two image tags first one is  the below one which only visible when the last element of the array comes
```html
 <img (appIntersectionListener)="loadItems()" #lastItem *ngIf="i+1===items.length" class="img h-full w-full rounded-md object-cover" [src]="item.src.large" alt="" crossorigin>
```
 This image tag has the (appIntersectionListener) attribute, which listens for the appIntersectionListener event emitted by the IntersectionListenerDirective. When the last item in the array becomes visible, the event is emitted, and it triggers the loadItems() function in the `image-list2.component.ts` and more images will load.
 
 ***Now the final step***
 3) add the component in `app.component.html`
 ```html
 <!--<app-image-list></app-image-list>-->
 <app-image-list2></app-image-list2>
 ```



https://github.com/Aashish-Lohar/infinite-scroll/assets/70789305/6f212a57-970f-4796-985b-a93f302750a3


 
I hope it helps whoever wants to develop infinite scroll without any libraries.




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
