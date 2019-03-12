import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

@Component({ templateUrl: 'trainings.component.html' })
export class TrainingsComponent implements OnInit {
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
        this.trainigService.getAllTrainings().pipe(first()).subscribe(trainings => {
            this.trainings = trainings;
        });
        this.getMyTrainings();
        this.getEmployeeTrainings();
       
    }

    getMyTrainings(){
        this.trainigService.getMyTrainings(this.currentUser.idUser).pipe(first()).subscribe(tr => {
            this.myTrainings = tr;
        });
    }

    getEmployeeTrainings(){
        this.trainigService.getEmployeeTrainings(this.currentUser.idUser, 1 ).pipe(first()).subscribe(tr => {
            this.myEmployeeTrainings = tr;
        });
    }
    

    onSubmit(training:Training) {
        this.trainigService.bindUserWithTraining(training, this.currentUser.idUser).subscribe(ok => {
            this.saved = true;
            setTimeout(_=> this.saved = false, 5000);
         });;
         
         this.getMyTrainings();

    }

    selectAgent(training: Training) : void {
        this.selected = training;
      }


}