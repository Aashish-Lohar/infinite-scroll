import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {} from 'rxjs';

@Directive({
  selector: '[appIntersectionListener]',
})
export class IntersectionListenerDirective implements AfterViewInit, OnInit {
  @Output() appIntersectionListener = new EventEmitter<boolean>();
  observer!: IntersectionObserver;
  @ViewChildren('lastItem') lastItem!: QueryList<ElementRef>;

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
      threshold: 1.0,
    };
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log('scroll more');
        this.appIntersectionListener.emit(true);
      }
    }, options);
  }
}
