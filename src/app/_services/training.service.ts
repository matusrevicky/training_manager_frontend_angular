import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Training } from '@/_models/training';

@Injectable({ providedIn: 'root' })
export class TrainingService {
    constructor(private http: HttpClient) { }


    getAllTrainings(){
        return this.http.get<Training[]>(`${config.apiUrl}/trainings`);
    }

     bindUserWithTraining(training:Training, id: number):Observable<boolean> {
        return this.http.post(`${config.apiUrl}/trainings/bindwithuser/${id}`, training).pipe(map( _ => true));
      }

}