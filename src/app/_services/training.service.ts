import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '@/_models';
import { Training } from '@/_models/training';

@Injectable({ providedIn: 'root' })
export class TrainingService {
    constructor(private http: HttpClient) { }


    getAllTrainings(){
        return this.http.get<Training[]>(`${config.apiUrl}/trainings`);
    }

}