import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { UserInfoService } from '../services/user-info.service';
import { User } from '../model/user.model';
import { NavController } from '@ionic/angular';
import { Listing } from '../model/listing.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
    // Initialization of the 2 variables that we'll use to import data.
    private listing: Listing;
    listingData: string;
    listingCount: number;

    // Initializing Client's User ID for querying.

  constructor(private http: HttpClient, private mainUser: UserInfoService, private navCtrl: NavController, public alertController: AlertController) { 
  }
  ngOnInit() {
    this.http.get('http://localhost:5000/api/listings/available').subscribe((response) => {
      // Janky way to parse response into a usable object array that can manipulated.
      this.listingData = JSON.stringify(response);
      this.listing = JSON.parse(this.listingData);
      this.listingCount = Object.keys(this.listing).length;

      // Testing/debugging
      // console.log(this.listing);
      // console.log(this.listing[0]);
      // console.log(this.listing[1].listingName);
      // console.log(this.listing[2]);
      // console.log(this.listingCount);
 });
  }

  refreshButton(){
    this.http.get('http://localhost:5000/api/listings/available').subscribe((response) => {
      // Janky way to parse response into a usable object array that can manipulated.
      this.listingData = JSON.stringify(response);
      this.listing = JSON.parse(this.listingData);
      this.listingCount = Object.keys(this.listing).length;

      // Testing/debugging
      // console.log(this.listing);
      // console.log(this.listing[0]);
      // console.log(this.listing[1].listingName);
      // console.log(this.listing[2]);
      // console.log(this.listingCount);
 });
    
  }

  async expandClicked(list){
    list.listingClientID = this.mainUser.getUserID();
    const alert = await this.alertController.create({
      header: list.listingName,
      subHeader: list.listingPrice,
      message: list.listingDescription,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Order',
          handler: () => {
            this.http.post('http://localhost:5000/api/listings/update/', list).subscribe(()=>{
              });
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

}
