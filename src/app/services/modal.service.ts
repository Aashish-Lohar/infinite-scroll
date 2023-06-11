import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class ModalService{
    isModalOpen:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false)
    constructor(){}

    isModalOpenFunc(){
        return this.isModalOpen.asObservable()
    }
}