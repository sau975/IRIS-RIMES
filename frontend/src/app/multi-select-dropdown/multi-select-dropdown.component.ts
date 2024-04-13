import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.css'],
})
export class MultiSelectDropdownComponent {
  @Input() list: any[]=[];
  @Input() type: string='';

  @Output() shareCheckedList = new EventEmitter();
  @Output() shareIndividualCheckedList = new EventEmitter();

  showDropDown: boolean = false;
  checkedList: any[];
  currentSelected: {}={};

  private _clear: boolean = false;
  @Input() get clear(): boolean {
    return this._clear;
  }
  set clear(value: boolean) {
    this._clear = value;
    console.log(value, "pppppppp")
    if(value == true){
      this.checkedList = []
    }
  }

  constructor() {
    this.checkedList = [];
  }

  getSelectedValue(status: Boolean, value: String) {
    if (status) {
      this.checkedList.push(value);
    } else {
      var index = this.checkedList.indexOf(value);
      this.checkedList.splice(index, 1);
    }

    console.log(this.checkedList,"oooooooooo")
    // this.currentSelected = { checked: status, name: value };

    //share checked list
    this.shareCheckedlist();

    //share individual selected item
    this.shareIndividualStatus();
  }
  shareCheckedlist() {
    this.shareCheckedList.emit(this.checkedList);
  }
  shareIndividualStatus() {
    this.shareIndividualCheckedList.emit(this.currentSelected);
  }
}
