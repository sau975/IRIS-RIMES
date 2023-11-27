import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-station-level-data',
  templateUrl: './station-level-data.component.html',
  styleUrls: ['./station-level-data.component.css']
})
export class StationLevelDataComponent implements OnInit {
  ngOnInit(): void {
  //   var $table = $('#table');
  //   $(function () {
  //       $('#toolbar').find('select').change(function () {
  //           $table.bootstrapTable('refreshOptions', {
  //               exportDataType: $(this).val()
  //           });
  //       });
  //   })

	// 	var trBoldBlue = $("table");

	// $(trBoldBlue).on("click", "tr", function (){
	// 		$(this).toggleClass("bold-blue");
	// });
  }

  selected!: any;
  data = [
    {Sno: 1, station: "Biharshrif", district: "Nalanda", railFall: 12.5, updatedDate: "26/11/2023 22:10"},
    {Sno: 2, station: "Biharshrif", district: "Nalanda", railFall: 25.5, updatedDate: "26/11/2023 22:10"},
    {Sno: 3, station: "Biharshrif", district: "Nalanda", railFall: 22.15, updatedDate: "26/11/2023 22:10"},
    {Sno: 4, station: "Biharshrif", district: "Nalanda", railFall: 25.25, updatedDate: "26/11/2023 22:10"},
    {Sno: 5, station: "Biharshrif", district: "Nalanda", railFall: 28.5, updatedDate: "26/11/2023 22:10"},
    {Sno: 6, station: "Biharshrif", district: "Nalanda", railFall: 29.85, updatedDate: "26/11/2023 22:10"},
    {Sno: 7, station: "Biharshrif", district: "Nalanda", railFall: 2.55, updatedDate: "26/11/2023 22:10"},
  ]
}