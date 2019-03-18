import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

@Component({ templateUrl: 'MyEmployeesTrainings.component.html' })
export class MyEmployeesTrainingsComponent implements OnInit {
   
    myEmployeeTrainings: Training[] = [];
    
    private training: Training;
    private selected: Training;
    currentUser: User;
    private saved: boolean;

    constructor(private userService: UserService, private trainigService: TrainingService, private authenticationService: AuthenticationService) 
    { this.currentUser = this.authenticationService.currentUserValue; }

    ngOnInit() {
        this.getEmployeeTrainings();
    }

    getEmployeeTrainings(){
        this.trainigService.getEmployeeTrainings(this.currentUser.idUser ).pipe(first()).subscribe(tr => {
            this.myEmployeeTrainings = tr;
        });
    }
    
    onApprove(training:Training) {
        this.trainigService.acceptUserTraining(training, this.currentUser.idUser,this.currentUser.role ).subscribe(ok => {
            this.saved = true;
            setTimeout(_=> this.saved = false, 5000);
         });;
         
         this.getEmployeeTrainings();

    }

    onDeny(training:Training) {
        this.trainigService.denyUserTraining(training, this.currentUser.idUser,this.currentUser.role ).subscribe(ok => {
            this.saved = true;
            setTimeout(_=> this.saved = false, 5000);
         });;
         
         this.getEmployeeTrainings();

    }


    selectAgent(training: Training) : void {
        this.selected = training;
      }


}