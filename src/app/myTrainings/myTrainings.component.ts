import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

@Component({ templateUrl: 'myTrainings.component.html' })
export class MyTrainingsComponent implements OnInit {
    //  users: User[] = [];
    trainings: Training[] = [];
    myTrainings: Training[] = [];
    myEmployeeTrainings: Training[] = [];
    
    private training: Training;
    private selected: Training;
    currentUser: User;
    private saved: boolean;

    constructor(private userService: UserService, private trainigService: TrainingService, private authenticationService: AuthenticationService) 
    { this.currentUser = this.authenticationService.currentUserValue; }

    ngOnInit() {
        this.getMyTrainings();
    }

    getMyTrainings(){
        this.trainigService.getMyTrainings(this.currentUser.idUser).pipe(first()).subscribe(tr => {
            this.myTrainings = tr;
        });
    }

   

}