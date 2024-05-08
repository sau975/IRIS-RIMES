import { Component } from '@angular/core';

@Component({
  selector: 'app-state-wise',
  templateUrl: './state-wise.component.html',
  styleUrls: ['./state-wise.component.css']
})
export class StateWiseComponent {
  
selectedState : String ="";
StateList : any[] = ["asd","asd","asdaad","asdada"];

shareCheckedList(item:any[]){
  console.log(item);
}

onChangeState(event: any) {
  const selectedValue = event.target.value;
  console.log('Selected value:', selectedValue);
}

}
