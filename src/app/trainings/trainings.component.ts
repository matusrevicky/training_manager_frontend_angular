import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

@Component({ templateUrl: 'trainings.component.html' })
export class TrainingsComponent implements OnInit {

    trainings: Training[] = [];

    private training: Training;
    private selected: Training;
    currentUser: User;
    private saved: boolean;

    constructor(private userService: UserService, private trainigService: TrainingService, private authenticationService: AuthenticationService) { this.currentUser = this.authenticationService.currentUserValue; }

    ngOnInit() {
        this.getAllTrainings();

    }

    getAllTrainings() {
        this.trainigService.getAllTrainings().pipe(first()).subscribe(trainings => {
            this.trainings = trainings;
        });
    }

    onSubmit(training: Training) {
        this.trainigService.bindUserWithTraining(training, this.currentUser.idUser).subscribe(ok => {
            this.saved = true;
            setTimeout(_ => this.saved = false, 5000);
        });;
    }

    onApprove(training: Training) {
        this.trainigService.acceptUserTraining(training, this.currentUser.idUser, this.currentUser.role ).subscribe(ok => {
            this.saved = true;
            setTimeout(_ => this.saved = false, 5000);
        });;

    }

    selectAgent(training: Training): void {
        this.selected = training;
    }

}