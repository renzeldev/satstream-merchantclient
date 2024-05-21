import { Component, OnInit } from '@angular/core';
import { MerchantDataModel } from 'src/share/model/MerchantDataModel';
import { MerchantStreamModel } from 'src/share/model/MerchantStreamModel';
import { WithdrawalModel } from 'src/share/model/WithdrawalModel';
import { WebSocketService } from 'src/app/service/web-socket.service';
import { SatStreamService } from 'src/app/service/sat-stream.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  merchantName: string = "John Doe"
  merchantInfo: MerchantDataModel
  satBalance: string = (-70).toString()
  selectedStreamId: any = ""
  selectedStream: MerchantStreamModel | null
  selectedStreamInfo: string = ""
  withdrawalAmount: number
  newWithDrawalCode: string
  withdrawal: WithdrawalModel | null
  withdrawalId: any = ""
  MerchantId: any
  streamStatus = ["", "Initiated", "Confirmed", "Streaming", "Stream Stopped"]
  withdrawed: boolean = false;
  withdrawals: WithdrawalModel[] = [
    
  ]
  streams: MerchantStreamModel[] = [
    
  ]
  spinner: boolean = false
  constructor(
    private satStreamService: SatStreamService,
    private webSocketService: WebSocketService,
    private router: ActivatedRoute,
    private route: Router,
    private actRoute: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    // this.MerchantId = this.actRoute.snapshot.params['id'];
    // if(!this.MerchantId) {
    //   this.route.navigateByUrl("/Merchant/1");
    //   return;
    // }
    this.router.paramMap.subscribe((query: any) => {
      if (query.params.MerchantId) { 
        this.MerchantId = query.params.MerchantId;
        this.webSocketService.listen("MerchantBalanceNotification").subscribe((response: any) => {
          console.log(response);
          if( this.merchantInfo.MerchantId = response.MerchantId) {
            this.merchantInfo.SatBalance = response.balance;
          }
        })
        this.webSocketService.listen("WithdrawalNotification").subscribe((response) => {
          if( this.withdrawals.filter(i => i.WithdrawalId == response.WithdrawalId).length > 0) {
            for(var i = 0; i < this.withdrawals.length; i++) {
              if(this.withdrawals[i].WithdrawalId == response.WithdrawalId) {
                this.withdrawals[i] = {...this.withdrawals[i],  ...response };
                this.withdrawal = null;
                this.withdrawalId = ""
                this.withdrawals.unshift(this.withdrawals[i]);
                this.withdrawals.splice(i+1,2);
                this.withdrawals = this.withdrawals.sort((a: any, b: any) => b.WithdrawalId - a.WithdrawalId);
              }
            }
            
          } else {
            let newWithdrawal: WithdrawalModel = {...response};
            this.withdrawal = null;
            this.withdrawals.unshift(newWithdrawal);
            this.withdrawed = true;
            this.withdrawals = this.withdrawals.sort((a: any, b: any) => b.WithdrawalId - a.WithdrawalId);
          }
        })
        this.webSocketService.listen("StreamNotification").subscribe((response) => {
          this.selectedStreamId = "";
          if(response.MerchantId == this.MerchantId) {
            if(this.streams.filter(stream => stream.StreamId == response.StreamId).length === 0) {
              let newStream: MerchantStreamModel = {...response}
              this.streams.unshift(newStream);
            } else {
              for(var i = 0; i < this.streams.length; i ++) {
                if(this.streams[i].StreamId == response.StreamId) {
                  this.streams[i] = {...this.streams[i], ...response};
                  this.streams.unshift(this.streams[i]);
                  this.streams.splice(i+1, 1);
                  break;
                }
              }
            }
          }
        })
        this.satStreamService.getMerchantData(this.MerchantId).subscribe((response: string) => {
          this.merchantInfo = JSON.parse(response);
          if(this.merchantInfo) {
            this.satStreamService.getMerchantStreams(this.MerchantId).subscribe((response: string) => {
              let streams = JSON.parse(response);
              streams.sort((a: any,b: any) => new Date(b.CreatedDate).getTime()-new Date(a.CreatedDate).getTime())
              streams.sort((a: any,b: any) => new Date(b.UpdateDate).getTime()-new Date(a.UpdateDate).getTime())
              this.streams = streams;
            })
            this.satStreamService.getMerchantWithdrawals(this.MerchantId).subscribe((response: string) => { 
              this.withdrawals = JSON.parse(response);
              this.withdrawals = this.withdrawals.sort((a: any, b: any) => b.WithdrawalId - a.WithdrawalId);
            })
          }      
        })
      }
    })
  }

  async viewWithdrawal($event:any) {
    let withdrawalId = $event.target.value;
    if(withdrawalId) {
      this.withdrawal = await this.withdrawals.filter(deposit => deposit.WithdrawalId == withdrawalId)[0];
      this.withdrawal.CreationDate = new Date(this.withdrawal.CreationDate).toLocaleString();
      this.withdrawal.UpdateDate = this.withdrawal.UpdateDate ? new Date(this.withdrawal.UpdateDate).toLocaleString(): null;
    } else {
      this.withdrawal = null;
    }
  }

  withdraw(): void {
    this.withdrawed = false;
    if(this.withdrawalAmount) {
      this.spinner = true;
      var modal = document.getElementById('newWithdrawal');
      if(modal) modal.style.display = 'none';
      var backdrop = document.querySelector('.modal-backdrop.show');
      backdrop?.remove()
      this.satStreamService.doWithdrawal(this.withdrawalAmount, this.MerchantId).subscribe((response) => {
        this.newWithDrawalCode = response;
        this.spinner = false;
      })
      document.getElementById("qrBtn")?.click();
    }
    
  }

}
