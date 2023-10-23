import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '../interface/custom-response';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({
  providedIn: 'root'
})
export class ServerService {


  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

private handleError(error: HttpErrorResponse): Observable<never>{
  console.log(error);
  return throwError("Method not implemented .")

}

  // api call  method for getting the servers
 servers$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
    );

    //posting / saving a server to the db
  save$ = (server:Server) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
     .pipe(
     tap(console.log),
     catchError(this.handleError)
    );

    //pinging to the ipAddress

    ping$ =(ipAddress: string) => <Observable<CustomResponse>>
       this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
        .pipe(
          tap(console.log),
          catchError(this.handleError)
        )


        // filtering happening here

    filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>>
    // we wnat to make it return a new Observable....we can also use switchmap to transform to th eobservable we want
        new Observable<CustomResponse>(
          suscriber => {
            console.log(response);
            suscriber.next(
              // we want to overwrite only the message
              status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status` } :
                {
                  ...response,

                  message: response.data.servers!
                    .filter(server => server.status === status).length > 0 ? `Servers filtered by
              ${status === Status.SERVER_UP ? 'SERVER UP'
                    : 'SERVER DOWN'} status` : `No servers of ${status} found`,
                    //overwriting data
                  data: {
                    servers: response.data.servers!
                      .filter(server => server.status === status)
                  }
                }
            );
            suscriber.complete();
          }
        )
          .pipe(
            tap(console.log),
            catchError(this.handleError)
          );


  // deleting  a  server

      delete$ = (serverId: number) => <Observable<CustomResponse>>
        this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
          .pipe(
            tap(console.log),
            catchError(this.handleError)
          );




}
