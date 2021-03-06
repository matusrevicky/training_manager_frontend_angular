import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { Training } from '@/_models/training';
import { TrainingService } from '@/_services/training.service';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { FormControl } from '@angular/forms';

declare var $:any;

@Component({ templateUrl: 'myEmployeesTrainings.component.html' })
export class MyEmployeesTrainingsComponent implements OnInit {


  
    trainings$ = new BehaviorSubject([]);

    superlatives$ = new BehaviorSubject<{ [superlativeName: string]: string }>({});
    tableDataSource$ = new BehaviorSubject<any[]>([]);
    displayedColumns$ = new BehaviorSubject<string[]>([
        'nameUser',
        'nameTraining',
        'trainingStatus',
        'onApprove',
        'onDeny'
        
    ]);
    currentPage$ = new BehaviorSubject<number>(1);
    pageSize$ = new BehaviorSubject<number>(5);
    dataOnPage$ = new BehaviorSubject<any[]>([]);
    searchFormControl = new FormControl();
    sortKey$ = new BehaviorSubject<string>('nameUser');
    sortDirection$ = new BehaviorSubject<string>('asc');


  //  trainings: Training[] = [];

    private training: Training;
    private selected: Training;
    currentUser: User;
    private saved: boolean;
    

    constructor(private userService: UserService, private trainigService: TrainingService, private authenticationService: AuthenticationService) { this.currentUser = this.authenticationService.currentUserValue; }

    ngOnInit() {

        // loads data into behavorial subject
        this.getEmployeeTrainings();


        // console.log(this.tra$);
        this.trainings$.subscribe(changedHeroData => {
            const superlatives = {
                'highest-attack': null,
                'lowest-attack': null,
                'highest-defense': null,
                'lowest-defense': null,
                'highest-speed': null,
                'lowest-speed': null,
                'highest-healing': null,
                'lowest-healing': null,
                'highest-recovery': null,
                'lowest-recovery': null,
                'highest-health': null,
                'lowest-health': null
            };

            Object.values(changedHeroData).forEach(hero => {
                Object.keys(hero).forEach(key => {
                    if (key === 'nameUser' || key === 'types') { return; }

                    const highest = `highest-${key}`;
                    if (!superlatives[highest] || hero[key] > changedHeroData[superlatives[highest]][key]) {
                        superlatives[highest] = hero.nameUser;
                    }

                    const lowest = `lowest-${key}`;
                    if (!superlatives[lowest] || hero[key] < changedHeroData[superlatives[lowest]][key]) {
                        superlatives[lowest] = hero.nameUser;
                    }
                });
            });

            this.superlatives$.next(superlatives);
        });

        combineLatest(this.tableDataSource$, this.currentPage$, this.pageSize$)
            .subscribe(([allSources, currentPage, pageSize]) => {
                const startingIndex = (currentPage - 1) * pageSize;
                const onPage = allSources.slice(startingIndex, startingIndex + pageSize);
                this.dataOnPage$.next(onPage);
            });

        this.trainings$.pipe(take(1)).subscribe(heroData => {
            this.tableDataSource$.next(Object.values(heroData));
        });

        combineLatest(this.trainings$, this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$)
            .subscribe(([changedHeroData, searchTerm, sortKey, sortDirection]) => {
                const heroesArray = Object.values(changedHeroData);
                let filteredHeroes: any[];

                if (!searchTerm) {
                    filteredHeroes = heroesArray;
                } else {
                    const filteredResults = heroesArray.filter(hero => {
                        return Object.values(hero)
                            .reduce((prev, curr) => {
                                return prev || curr.toString().toLowerCase().includes(searchTerm.toLowerCase());
                            }, false);
                    });
                    filteredHeroes = filteredResults;
                }

                const sortedHeroes = filteredHeroes.sort((a, b) => {
                    if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
                    if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
                    return 0;
                });

                this.tableDataSource$.next(sortedHeroes);
            });

        this.searchFormControl.setValue('');
    }

    adjustSort(key: string) {
        if (this.sortKey$.value === key) {
            if (this.sortDirection$.value === 'asc') {
                this.sortDirection$.next('desc');
            } else {
                this.sortDirection$.next('asc');
            }
            return;
        }

        this.sortKey$.next(key);
        this.sortDirection$.next('asc');
    }

    getEmployeeTrainings() {
        this.trainigService.getEmployeeTrainings(this.currentUser.idUser).pipe(first()).subscribe(tr => {
            this.trainings$.next(tr);
        });
    }

    onApprove(training:Training) {
        this.trainigService.acceptUserTraining(training, this.currentUser.idUser,this.currentUser.role ).subscribe(ok => {
            this.getEmployeeTrainings();
            this.saved = true;
            setTimeout(_=> this.saved = false, 5000);
         });;
         
        
    
    }
    
    onDeny(training:Training) {
        this.trainigService.denyUserTraining(training, this.currentUser.idUser,this.currentUser.role ).subscribe(ok => {
            this.getEmployeeTrainings();
            this.saved = true;
            setTimeout(_=> this.saved = false, 5000);
         });;
         
        
    
    }
   
}




















