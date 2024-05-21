import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SatStreamService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private readonly baseUrl: string,
  ) { }
  
  getMerchantData(merchantId: any): Observable<string>{
    return this.http.get<string>(this.baseUrl + `api/merchant/${merchantId}`)
  }

  getMerchantStreams(merchantId: any): Observable<string>{
    return this.http.get<string>(this.baseUrl + `api/merchantstreams/${merchantId}`);
  }

  getMerchantWithdrawals(merchantId: any): Observable<string>{
    return this.http.get<string>(this.baseUrl + `api/withdrawals/${merchantId}`)
  }

  doStreamAction<T>(selectedStream: any): Observable<T>{
    return this.http.post<T>(this.baseUrl + `api/customerstreams`, { StreamId: selectedStream?.StreamId, StreamStatusId: selectedStream?.StreamStatusId })
  }

  doWithdrawal(amount:any, merchantId: any): Observable<string>{
    return this.http.post<string>(this.baseUrl + `api/withdrawals/${merchantId}`, { merchantid: merchantId, amount: amount })
  }

}
